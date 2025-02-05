use std::fs::read_dir;

fn main() -> Result<(), Box<dyn std::error::Error>> {
  let mut config = rosetta_build::config();

  for path in read_dir("translations/email/")? {
    let path = path?.path();
    if let Some(name) = path.file_name() {
      let lang = name.to_string_lossy().to_string().replace(".json", "");
      // Rosetta doesnt support these language variants.
      if lang.contains('_') {
        continue;
      }

      let path = path.to_string_lossy();
      rosetta_build::config()
        .source(&lang, path.clone())
        .fallback(&lang)
        .generate()?;

      config = config.source(lang, path);
    }
  }

  config.fallback("en").generate()?;

  Ok(())
}
