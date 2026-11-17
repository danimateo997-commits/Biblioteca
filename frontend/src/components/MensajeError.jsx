function MensajeError({ mensaje }) {
  if (!mensaje) return null;
  return <p className="aviso error" role="alert"><strong>No se pudo completar:</strong> {mensaje}</p>;
}
export default MensajeError;
