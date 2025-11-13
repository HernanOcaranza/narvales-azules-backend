import disciplinaRepository from '../repositories/disciplina.repository.js';

class DisciplinaService {
  async getAllDisciplinas() {
    try {
      return await disciplinaRepository.findAll();
    } catch (error) {
      throw new Error(`Error al obtener disciplinas: ${error.message}`);
    }
  }

  async getDisciplinaById(id) {
    try {
      const disciplina = await disciplinaRepository.findById(id);
      if (!disciplina) {
        throw new Error('Disciplina no encontrada');
      }
      return disciplina;
    } catch (error) {
      throw new Error(`Error al obtener disciplina: ${error.message}`);
    }
  }

  async createDisciplina(data) {
    try {
      // Validaciones de negocio
      if (!data.disciplina) {
        throw new Error('El campo disciplina es obligatorio');
      }

      // Verificar si ya existe una disciplina con el mismo nombre
      const existingDisciplina = await disciplinaRepository.findByDisciplina(data.disciplina);
      if (existingDisciplina) {
        throw new Error('Ya existe una disciplina con ese nombre');
      }

      // Validar longitud de campo
      if (data.disciplina.length > 20) {
        throw new Error('El campo disciplina no puede exceder 20 caracteres');
      }

      return await disciplinaRepository.create(data);
    } catch (error) {
      throw new Error(`Error al crear disciplina: ${error.message}`);
    }
  }

  async updateDisciplina(id, data) {
    try {
      // Validaciones de negocio
      if (data.disciplina && data.disciplina.length > 20) {
        throw new Error('El campo disciplina no puede exceder 20 caracteres');
      }

      // Si se está actualizando el nombre, verificar que no exista otra disciplina con ese nombre
      if (data.disciplina) {
        const existingDisciplina = await disciplinaRepository.findByDisciplina(data.disciplina);
        if (existingDisciplina && existingDisciplina.id_disciplina !== parseInt(id)) {
          throw new Error('Ya existe una disciplina con ese nombre');
        }
      }

      const disciplina = await disciplinaRepository.update(id, data);
      if (!disciplina) {
        throw new Error('Disciplina no encontrada');
      }
      return disciplina;
    } catch (error) {
      throw new Error(`Error al actualizar disciplina: ${error.message}`);
    }
  }

  async deleteDisciplina(id) {
    try {
      const deleted = await disciplinaRepository.delete(id);
      if (!deleted) {
        throw new Error('Disciplina no encontrada');
      }
      return { message: 'Disciplina eliminada correctamente' };
    } catch (error) {
      throw new Error(`Error al eliminar disciplina: ${error.message}`);
    }
  }
}

export default new DisciplinaService();

