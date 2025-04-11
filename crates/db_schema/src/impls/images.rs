use crate::{
  newtypes::DbUrl,
  schema::{image_details, local_image, remote_image},
  source::images::{ImageDetails, ImageDetailsForm, LocalImage, LocalImageForm, RemoteImage},
  utils::{get_conn, DbPool},
};
use diesel::{
  dsl::exists,
  insert_into,
  result::Error,
  select,
  ExpressionMethods,
  NotFound,
  QueryDsl,
};
use diesel_async::{scoped_futures::ScopedFutureExt, AsyncConnection, RunQueryDsl};
use url::Url;

impl LocalImage {
  pub async fn create(
    pool: &mut DbPool<'_>,
    form: &LocalImageForm,
    image_details_form: &ImageDetailsForm,
  ) -> Result<Self, Error> {
    let conn = &mut get_conn(pool).await?;
    conn
      .transaction::<_, Error, _>(|conn| {
        async move {
          let local_insert = insert_into(local_image::table)
            .values(form)
            .get_result::<Self>(conn)
            .await;

          ImageDetails::create(&mut conn.into(), image_details_form).await?;

          local_insert
        }
        .scope_boxed()
      })
      .await
  }

  pub async fn delete_by_alias(pool: &mut DbPool<'_>, alias: &str) -> Result<Self, Error> {
    let conn = &mut get_conn(pool).await?;
    diesel::delete(local_image::table.filter(local_image::pictrs_alias.eq(alias)))
      .get_result(conn)
      .await
  }

  pub async fn delete_by_url(pool: &mut DbPool<'_>, url: &DbUrl) -> Result<Self, Error> {
    let alias = url.as_str().split('/').last().ok_or(NotFound)?;
    Self::delete_by_alias(pool, alias).await
  }
}

impl RemoteImage {
  pub async fn create(pool: &mut DbPool<'_>, links: Vec<Url>) -> Result<usize, Error> {
    let conn = &mut get_conn(pool).await?;
    let forms = links
      .into_iter()
      .map(|url| remote_image::dsl::link.eq::<DbUrl>(url.into()))
      .collect::<Vec<_>>();
    insert_into(remote_image::table)
      .values(forms)
      .on_conflict_do_nothing()
      .execute(conn)
      .await
  }

  pub async fn validate(pool: &mut DbPool<'_>, link_: DbUrl) -> Result<(), Error> {
    let conn = &mut get_conn(pool).await?;

    let exists = select(exists(
      remote_image::table.filter(remote_image::link.eq(link_)),
    ))
    .get_result::<bool>(conn)
    .await?;
    if exists {
      Ok(())
    } else {
      Err(NotFound)
    }
  }
}

impl ImageDetails {
  pub async fn create(pool: &mut DbPool<'_>, form: &ImageDetailsForm) -> Result<usize, Error> {
    let conn = &mut get_conn(pool).await?;

    insert_into(image_details::table)
      .values(form)
      .on_conflict_do_nothing()
      .execute(conn)
      .await
  }
}
