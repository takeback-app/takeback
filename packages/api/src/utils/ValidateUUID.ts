export function validateUUID(uuid: string): Boolean {
  let s = "" + uuid;

  const isValid = s.match(
    "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
  );
  if (isValid === null) {
    return false;
  }
  return true;
}
