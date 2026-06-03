/**
 * Clase abstracta que define el contrato para proveedores de correo.
 *
 * ABSTRACCIÓN: Oculta la complejidad del transporte de correo (SMTP, API, etc.)
 * exponiendo solo una interfaz simple con el método send().
 *
 * Cualquier proveedor concreto (Gmail, SendGrid, Mailgun, etc.) debe extender
 * esta clase e implementar sus métodos abstractos.
 */
class MailProvider {
  /**
   * Envía un correo electrónico.
   *
   * @param {Object} opciones - Opciones del correo.
   * @param {string} opciones.to - Destinatario.
   * @param {string} opciones.subject - Asunto del correo.
   * @param {string} opciones.html - Cuerpo del correo en HTML.
   * @throws {Error} Si no está implementado por la subclase.
   */
  async send({ to, subject, html }) {
    throw new Error(`Método 'send' debe ser implementado por la subclase`);
  }

  /**
   * Valida que la configuración del proveedor sea correcta.
   *
   * @throws {Error} Si no está implementado por la subclase.
   */
  validateConfig() {
    throw new Error(`Método 'validateConfig' debe ser implementado por la subclase`);
  }
}

export default MailProvider;
