import nodemailer from 'nodemailer';
import MailProvider from './MailProvider.js';

/**
 * Proveedor concreto de correo para Gmail SMTP.
 *
 * HERENCIA: Extiende MailProvider e implementa los métodos abstractos.
 * ENCAPSULACIÓN: Los detalles internos (#transporter, #host, #user, #pass)
 * son campos privados inaccesibles desde el exterior. Solo se exponen
 * send() y validateConfig().
 */
class GmailMailProvider extends MailProvider {
  /** @type {import('nodemailer').Transporter} */
  #transporter;

  /** @type {string} */
  #host;

  /** @type {number} */
  #port;

  /** @type {boolean} */
  #secure;

  /** @type {string} */
  #user;

  /** @type {string} */
  #pass;

  /** @type {string} */
  #from;

  /**
   * @param {Object} config - Configuración SMTP de Gmail.
   * @param {string} config.host - Servidor SMTP (ej: smtp.gmail.com).
   * @param {number} config.port - Puerto SMTP (465 para SSL, 587 para TLS).
   * @param {boolean} config.secure - true para puerto 465, false para 587.
   * @param {string} config.user - Correo electrónico del remitente.
   * @param {string} config.pass - Contraseña de aplicación de Gmail.
   * @param {string} config.from - Dirección de origen del correo.
   */
  constructor({ host, port, secure, user, pass, from }) {
    super();
    this.#host = host;
    this.#port = port;
    this.#secure = secure;
    this.#user = user;
    this.#pass = pass;
    this.#from = from;

    this.#transporter = nodemailer.createTransport({
      host: this.#host,
      port: this.#port,
      secure: this.#secure,
      auth: {
        user: this.#user,
        pass: this.#pass,
      },
    });
  }

  /**
   * Envía un correo electrónico a través de Gmail SMTP.
   *
   * @param {Object} opciones - Opciones del correo.
   * @param {string} opciones.to - Destinatario.
   * @param {string} opciones.subject - Asunto del correo.
   * @param {string} opciones.html - Cuerpo del correo en HTML.
   * @returns {Promise<Object>} Información del mensaje enviado.
   * @throws {Error} Si falla el envío o la validación de configuración.
   */
  async send({ to, subject, html }) {
    this.validateConfig();

    const mailOptions = {
      from: this.#from,
      to,
      subject,
      html,
    };

    return await this.#transporter.sendMail(mailOptions);
  }

  /**
   * Valida que la configuración SMTP esté completa.
   *
   * @throws {Error} Si falta el usuario o la contraseña.
   */
  validateConfig() {
    if (!this.#user) {
      throw new Error('MAIL_USER no está configurado');
    }
    if (!this.#pass) {
      throw new Error('MAIL_PASS no está configurado');
    }
  }
}

export default GmailMailProvider;
