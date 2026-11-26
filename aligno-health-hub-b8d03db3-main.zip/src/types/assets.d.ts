declare module "*.asset.json" {
  const value: { url: string; original_filename: string; content_type: string; asset_id: string };
  export default value;
}