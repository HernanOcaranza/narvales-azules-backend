import categoriaRepository from '../repositories/categoria.repository.js';

class CategoriaService {
  async getAllCategorias() {
    try {
      return await categoriaRepository.findAll();
    } catch (error) {
      throw new Error(`Error al obtener categorías: ${error.message}`);
    }
  }

  async getCategoriaById(id) {
    try {
      const categoria = await categoriaRepository.findById(id);
      if (!categoria) {
        throw new Error('Categoría no encontrada');
      }
      return categoria;
    } catch (error) {
      throw new Error(`Error al obtener categoría: ${error.message}`);
    }
  }

  async createCategoria(data) {
    try {
      // Validaciones de negocio
      if (!data.categoria || !data.descripcion) {
        throw new Error('Los campos categoria y descripcion son obligatorios');
      }

      // Verificar si ya existe una categoría con el mismo nombre
      const existingCategoria = await categoriaRepository.findByCategoria(data.categoria);
      if (existingCategoria) {
        throw new Error('Ya existe una categoría con ese nombre');
      }

      // Validar longitud de campos
      if (data.categoria.length > 20) {
        throw new Error('El campo categoria no puede exceder 20 caracteres');
      }
      if (data.descripcion.length > 50) {
        throw new Error('El campo descripcion no puede exceder 50 caracteres');
      }

      return await categoriaRepository.create(data);
    } catch (error) {
      throw new Error(`Error al crear categoría: ${error.message}`);
    }
  }

  async updateCategoria(id, data) {
    try {
      // Validaciones de negocio
      if (data.categoria && data.categoria.length > 20) {
        throw new Error('El campo categoria no puede exceder 20 caracteres');
      }
      if (data.descripcion && data.descripcion.length > 50) {
        throw new Error('El campo descripcion no puede exceder 50 caracteres');
      }

      // Si se está actualizando el nombre, verificar que no exista otra categoría con ese nombre
      if (data.categoria) {
        const existingCategoria = await categoriaRepository.findByCategoria(data.categoria);
        if (existingCategoria && existingCategoria.id_categoria !== parseInt(id)) {
          throw new Error('Ya existe una categoría con ese nombre');
        }
      }

      const categoria = await categoriaRepository.update(id, data);
      if (!categoria) {
        throw new Error('Categoría no encontrada');
      }
      return categoria;
    } catch (error) {
      throw new Error(`Error al actualizar categoría: ${error.message}`);
    }
  }

  async deleteCategoria(id) {
    try {
      const deleted = await categoriaRepository.delete(id);
      if (!deleted) {
        throw new Error('Categoría no encontrada');
      }
      return { message: 'Categoría eliminada correctamente' };
    } catch (error) {
      throw new Error(`Error al eliminar categoría: ${error.message}`);
    }
  }
}

export default new CategoriaService();

