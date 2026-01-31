export default function validatePassword(password: string) {
  const regex = /^\S{8,}$/;

  return regex.test(password);
}
