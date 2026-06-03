import env from '../config/env.js';
import GmailMailProvider from '../mail/GmailMailProvider.js';
import MailProvider from '../mail/MailProvider.js';

/**
 * Servicio facade para el envío de correos electrónicos.
 *
 * POLIMORFISMO: Funciona con cualquier implementación de MailProvider.
 * Puede cambiar el proveedor en caliente sin modificar el código que
 * consume este servicio.
 */
class MailService {
  /** @type {MailProvider} */
  #provider;

  /**
   * @param {MailProvider} provider - Implementación concreta de MailProvider.
   */
  constructor(provider) {
    this.#provider = provider;
  }

  /**
   * Envía un correo electrónico.
   *
   * @param {Object} opciones - Opciones del correo.
   * @param {string} opciones.to - Destinatario.
   * @param {string} opciones.subject - Asunto del correo.
   * @param {string} opciones.html - Cuerpo del correo en HTML.
   * @returns {Promise<Object>} Información del mensaje enviado.
   * @throws {Error} Si falta algún campo obligatorio o falla el envío.
   */
  async sendMail({ to, subject, html }) {
    // Validar campos obligatorios
    if (!to) {
      throw new Error('El destinatario (to) es obligatorio');
    }
    if (!subject) {
      throw new Error('El asunto (subject) es obligatorio');
    }
    if (!html) {
      throw new Error('El cuerpo del mensaje (html) es obligatorio');
    }

    try {
      return await this.#provider.send({ to, subject, html });
    } catch (error) {
      throw new Error(`Error al enviar el correo: ${error.message}`);
    }
  }

  /**
   * Cambia el proveedor de correo en tiempo de ejecución.
   *
   * @param {MailProvider} provider - Nueva implementación de MailProvider.
   */
  setProvider(provider) {
    this.#provider = provider;
  }
}

// Exportar una instancia única con GmailProvider por defecto
const mailProvider = new GmailMailProvider({
  host: env.MAIL_HOST,
  port: env.MAIL_PORT,
  secure: env.MAIL_SECURE,
  user: env.MAIL_USER,
  pass: env.MAIL_PASS,
  from: env.MAIL_FROM,
});

export default new MailService(mailProvider);
