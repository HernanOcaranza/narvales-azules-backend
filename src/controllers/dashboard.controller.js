import dashboardService from '../services/dashboard.service.js';
import { successResponse, errorResponse } from '../utils/response.js';

class DashboardController {
  async getStats(req, res) {
    try {
      const stats = await dashboardService.getStats();
      return successResponse(res, stats, 'Estadísticas obtenidas correctamente');
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  }
}

export default new DashboardController();