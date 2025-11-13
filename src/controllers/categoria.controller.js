import categoriaService from '../services/categoria.service.js';
import { successResponse, errorResponse } from '../utils/response.js';

class CategoriaController {
  async getAll(req, res) {
    try {
      const categorias = await categoriaService.getAllCategorias();
      return successResponse(res, categorias, 'Categorías obtenidas correctamente');
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      const categoria = await categoriaService.getCategoriaById(id);
      return successResponse(res, categoria, 'Categoría obtenida correctamente');
    } catch (error) {
      const statusCode = error.message.includes('no encontrada') ? 404 : 500;
      return errorResponse(res, error.message, statusCode);
    }
  }

  async create(req, res) {
    try {
      const categoria = await categoriaService.createCategoria(req.body);
      return successResponse(res, categoria, 'Categoría creada correctamente', 201);
    } catch (error) {
      const statusCode = error.message.includes('ya existe') ? 409 : 
                        error.message.includes('obligatorio') || error.message.includes('exceder') ? 400 : 500;
      return errorResponse(res, error.message, statusCode);
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const categoria = await categoriaService.updateCategoria(id, req.body);
      return successResponse(res, categoria, 'Categoría actualizada correctamente');
    } catch (error) {
      const statusCode = error.message.includes('no encontrada') ? 404 : 
                        error.message.includes('ya existe') ? 409 :
                        error.message.includes('exceder') ? 400 : 500;
      return errorResponse(res, error.message, statusCode);
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const result = await categoriaService.deleteCategoria(id);
      return successResponse(res, result, 'Categoría eliminada correctamente');
    } catch (error) {
      const statusCode = error.message.includes('no encontrada') ? 404 : 500;
      return errorResponse(res, error.message, statusCode);
    }
  }
}

export default new CategoriaController();

