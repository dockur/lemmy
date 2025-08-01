use crate::{
  activities::{
    deletion::{receive_delete_action, verify_delete_activity, DeletableObjects},
    generate_activity_id,
  },
  protocol::activities::deletion::{delete::Delete, undo_delete::UndoDelete},
};
use activitypub_federation::{config::Data, kinds::activity::UndoType, traits::Activity};
use lemmy_api_utils::context::LemmyContext;
use lemmy_apub_objects::objects::person::ApubPerson;
use lemmy_db_schema::{
  source::{
    comment::{Comment, CommentUpdateForm},
    community::{Community, CommunityUpdateForm},
    mod_log::{
      admin::{AdminRemoveCommunity, AdminRemoveCommunityForm},
      moderator::{ModRemoveComment, ModRemoveCommentForm, ModRemovePost, ModRemovePostForm},
    },
    post::{Post, PostUpdateForm},
  },
  traits::Crud,
};
use lemmy_utils::error::{FederationError, LemmyError, LemmyErrorType, LemmyResult};
use url::Url;

#[async_trait::async_trait]
impl Activity for UndoDelete {
  type DataType = LemmyContext;
  type Error = LemmyError;

  fn id(&self) -> &Url {
    &self.id
  }

  fn actor(&self) -> &Url {
    self.actor.inner()
  }

  async fn verify(&self, data: &Data<Self::DataType>) -> Result<(), Self::Error> {
    self.object.verify(data).await?;
    verify_delete_activity(&self.object, self.object.summary.is_some(), data).await?;
    Ok(())
  }

  async fn receive(self, context: &Data<LemmyContext>) -> LemmyResult<()> {
    if self.object.summary.is_some() {
      UndoDelete::receive_undo_remove_action(
        &self.actor.dereference(context).await?,
        self.object.object.id(),
        context,
      )
      .await
    } else {
      receive_delete_action(self.object.object.id(), &self.actor, false, None, context).await
    }
  }
}

impl UndoDelete {
  pub(in crate::activities::deletion) fn new(
    actor: &ApubPerson,
    object: DeletableObjects,
    to: Vec<Url>,
    community: Option<&Community>,
    summary: Option<String>,
    context: &Data<LemmyContext>,
  ) -> LemmyResult<UndoDelete> {
    let object = Delete::new(actor, object, to.clone(), community, summary, context)?;

    let id = generate_activity_id(UndoType::Undo, context)?;
    let cc: Option<Url> = community.map(|c| c.ap_id.clone().into());
    Ok(UndoDelete {
      actor: actor.ap_id.clone().into(),
      to,
      object,
      cc: cc.into_iter().collect(),
      kind: UndoType::Undo,
      id,
    })
  }

  pub(in crate::activities) async fn receive_undo_remove_action(
    actor: &ApubPerson,
    object: &Url,
    context: &Data<LemmyContext>,
  ) -> LemmyResult<()> {
    match DeletableObjects::read_from_db(object, context).await? {
      DeletableObjects::Community(community) => {
        if community.local {
          Err(FederationError::OnlyLocalAdminCanRestoreCommunity)?
        }
        let form = AdminRemoveCommunityForm {
          mod_person_id: actor.id,
          community_id: community.id,
          removed: Some(false),
          reason: None,
        };
        AdminRemoveCommunity::create(&mut context.pool(), &form).await?;
        Community::update(
          &mut context.pool(),
          community.id,
          &CommunityUpdateForm {
            removed: Some(false),
            ..Default::default()
          },
        )
        .await?;
      }
      DeletableObjects::Post(post) => {
        let form = ModRemovePostForm {
          mod_person_id: actor.id,
          post_id: post.id,
          removed: Some(false),
          reason: None,
        };
        ModRemovePost::create(&mut context.pool(), &form).await?;
        Post::update(
          &mut context.pool(),
          post.id,
          &PostUpdateForm {
            removed: Some(false),
            ..Default::default()
          },
        )
        .await?;
      }
      DeletableObjects::Comment(comment) => {
        let form = ModRemoveCommentForm {
          mod_person_id: actor.id,
          comment_id: comment.id,
          removed: Some(false),
          reason: None,
        };
        ModRemoveComment::create(&mut context.pool(), &form).await?;
        Comment::update(
          &mut context.pool(),
          comment.id,
          &CommentUpdateForm {
            removed: Some(false),
            ..Default::default()
          },
        )
        .await?;
      }
      // TODO these need to be implemented yet, for now, return errors
      DeletableObjects::PrivateMessage(_) => Err(LemmyErrorType::NotFound)?,
      DeletableObjects::Person(_) => Err(LemmyErrorType::NotFound)?,
    }
    Ok(())
  }
}
