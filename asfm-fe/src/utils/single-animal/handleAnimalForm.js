export default function handleChange(e, viewAnimal, prop) {
  setViewAnimal({ ...viewAnimal, [prop]: e.target.value });
}
