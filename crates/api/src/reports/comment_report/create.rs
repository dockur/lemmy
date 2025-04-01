use crate::check_report_reason;
use activitypub_federation::config::Data;
use actix_web::web::Json;
use lemmy_api_common::{
  context::LemmyContext,
  reports::comment::{CommentReportResponse, CreateCommentReport},
  send_activity::{ActivityChannel, SendActivityData},
  utils::{check_comment_deleted_or_removed, check_community_user_action, slur_regex},
};
use lemmy_db_schema::{
  source::comment_report::{CommentReport, CommentReportForm},
  traits::Reportable,
};
use lemmy_db_views::structs::{CommentReportView, CommentView, LocalUserView, SiteView};
use lemmy_email::admin::send_new_report_email_to_admins;
use lemmy_utils::error::LemmyResult;

/// Creates a comment report and notifies the moderators of the community
pub async fn create_comment_report(
  data: Json<CreateCommentReport>,
  context: Data<LemmyContext>,
  local_user_view: LocalUserView,
) -> LemmyResult<Json<CommentReportResponse>> {
  let reason = data.reason.trim().to_string();
  let slur_regex = slur_regex(&context).await?;
  check_report_reason(&reason, &slur_regex)?;

  let person_id = local_user_view.person.id;
  let comment_id = data.comment_id;
  let comment_view = CommentView::read(
    &mut context.pool(),
    comment_id,
    Some(&local_user_view.local_user),
  )
  .await?;

  check_community_user_action(
    &local_user_view,
    &comment_view.community,
    &mut context.pool(),
  )
  .await?;

  // Don't allow creating reports for removed / deleted comments
  check_comment_deleted_or_removed(&comment_view.comment)?;

  let report_form = CommentReportForm {
    creator_id: person_id,
    comment_id,
    original_comment_text: comment_view.comment.content,
    reason,
    violates_instance_rules: data.violates_instance_rules.unwrap_or_default(),
  };

  let report = CommentReport::report(&mut context.pool(), &report_form).await?;

  let comment_report_view =
    CommentReportView::read(&mut context.pool(), report.id, person_id).await?;

  // Email the admins
  let local_site = SiteView::read_local(&mut context.pool()).await?.local_site;
  if local_site.reports_email_admins {
    send_new_report_email_to_admins(
      &comment_report_view.creator.name,
      &comment_report_view.comment_creator.name,
      &mut context.pool(),
      context.settings(),
    )
    .await?;
  }

  ActivityChannel::submit_activity(
    SendActivityData::CreateReport {
      object_id: comment_view.comment.ap_id.inner().clone(),
      actor: local_user_view.person,
      community: comment_view.community,
      reason: data.reason.clone(),
    },
    &context,
  )?;

  Ok(Json(CommentReportResponse {
    comment_report_view,
  }))
}
