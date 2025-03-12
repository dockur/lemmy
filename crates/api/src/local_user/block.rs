use actix_web::web::{Data, Json};
use lemmy_api_common::{
  context::LemmyContext,
  person::{BlockPerson, BlockPersonResponse},
};
use lemmy_db_schema::{
  source::person::{PersonActions, PersonBlockForm},
  traits::Blockable,
};
use lemmy_db_views::structs::{LocalUserView, PersonView};
use lemmy_utils::error::{LemmyErrorType, LemmyResult};

pub async fn user_block_person(
  data: Json<BlockPerson>,
  context: Data<LemmyContext>,
  local_user_view: LocalUserView,
) -> LemmyResult<Json<BlockPersonResponse>> {
  let target_id = data.person_id;
  let person_id = local_user_view.person.id;

  // Don't let a person block themselves
  if target_id == person_id {
    Err(LemmyErrorType::CantBlockYourself)?
  }

  let person_block_form = PersonBlockForm::new(person_id, target_id);

  let target_user = LocalUserView::read_person(&mut context.pool(), target_id)
    .await
    .ok();

  if target_user.is_some_and(|t| t.local_user.admin) {
    Err(LemmyErrorType::CantBlockAdmin)?
  }

  if data.block {
    PersonActions::block(&mut context.pool(), &person_block_form).await?;
  } else {
    PersonActions::unblock(&mut context.pool(), &person_block_form).await?;
  }

  let person_view = PersonView::read(&mut context.pool(), target_id, false).await?;
  Ok(Json(BlockPersonResponse {
    person_view,
    blocked: data.block,
  }))
}
