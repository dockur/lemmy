use crate::{activities::deletion::DeletableObjects, protocol::IdOrNestedObject};
use activitypub_federation::{
  config::Data,
  fetch::object_id::ObjectId,
  kinds::activity::DeleteType,
  protocol::{helpers::deserialize_one_or_many, tombstone::Tombstone},
};
use anyhow::anyhow;
use lemmy_api_utils::context::LemmyContext;
use lemmy_apub_objects::{
  objects::{community::ApubCommunity, person::ApubPerson},
  utils::protocol::InCommunity,
};
use lemmy_db_schema::{
  source::{community::Community, post::Post},
  traits::Crud,
};
use lemmy_utils::error::LemmyResult;
use serde::{Deserialize, Serialize};
use serde_with::skip_serializing_none;
use url::Url;

#[skip_serializing_none]
#[derive(Clone, Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Delete {
  pub(crate) actor: ObjectId<ApubPerson>,
  #[serde(deserialize_with = "deserialize_one_or_many")]
  pub(crate) to: Vec<Url>,
  pub(crate) object: IdOrNestedObject<Tombstone>,
  #[serde(rename = "type")]
  pub(crate) kind: DeleteType,
  pub(crate) id: Url,

  #[serde(deserialize_with = "deserialize_one_or_many")]
  #[serde(default)]
  #[serde(skip_serializing_if = "Vec::is_empty")]
  pub(crate) cc: Vec<Url>,
  /// If summary is present, this is a mod action (Remove in Lemmy terms). Otherwise, its a user
  /// deleting their own content.
  pub(crate) summary: Option<String>,
  /// Nonstandard field, only valid if object refers to a Person. If present, all content from the
  /// user should be deleted along with the account
  pub(crate) remove_data: Option<bool>,
}

impl InCommunity for Delete {
  async fn community(&self, context: &Data<LemmyContext>) -> LemmyResult<ApubCommunity> {
    let community_id = match DeletableObjects::read_from_db(self.object.id(), context).await? {
      DeletableObjects::Community(c) => c.id,
      DeletableObjects::Comment(c) => {
        let post = Post::read(&mut context.pool(), c.post_id).await?;
        post.community_id
      }
      DeletableObjects::Post(p) => p.community_id,
      DeletableObjects::Person(_) => return Err(anyhow!("Person is not part of community").into()),
      DeletableObjects::PrivateMessage(_) => {
        return Err(anyhow!("Private message is not part of community").into())
      }
    };
    let community = Community::read(&mut context.pool(), community_id).await?;
    Ok(community.into())
  }
}
