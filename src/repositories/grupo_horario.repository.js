import db from '../models/index.js';

const { GrupoHorario, Grupo } = db;

class GrupoHorarioRepository {
  async findAll() {
    return await GrupoHorario.findAll({
      include: [
        {
          model: Grupo,
          as: 'grupo',
          attributes: ['id_grupo', 'nombre', 'cupo_maximo', 'estado']
        }
      ],
      order: [['dia_semana', 'ASC'], ['hora_inicio', 'ASC']]
    });
  }

  async findById(id) {
    return await GrupoHorario.findByPk(id, {
      include: [
        {
          model: Grupo,
          as: 'grupo',
          attributes: ['id_grupo', 'nombre', 'cupo_maximo', 'estado']
        }
      ]
    });
  }

  async findByGrupo(idGrupo) {
    return await GrupoHorario.findAll({
      where: { 
        id_grupo: idGrupo,
        activo: 1
      },
      include: [
        {
          model: Grupo,
          as: 'grupo',
          attributes: ['id_grupo', 'nombre', 'cupo_maximo', 'estado']
        }
      ],
      order: [['dia_semana', 'ASC'], ['hora_inicio', 'ASC']]
    });
  }

  async findByDiaSemana(diaSemana) {
    return await GrupoHorario.findAll({
      where: { 
        dia_semana: diaSemana,
        activo: 1
      },
      include: [
        {
          model: Grupo,
          as: 'grupo',
          attributes: ['id_grupo', 'nombre', 'cupo_maximo', 'estado']
        }
      ],
      order: [['hora_inicio', 'ASC']]
    });
  }

  async create(data) {
    return await GrupoHorario.create(data);
  }

  async createMany(horarios) {
    return await GrupoHorario.bulkCreate(horarios);
  }

  async update(id, data) {
    const horario = await GrupoHorario.findByPk(id);
    if (!horario) {
      return null;
    }
    return await horario.update(data);
  }

  async delete(id) {
    const horario = await GrupoHorario.findByPk(id);
    if (!horario) {
      return false;
    }
    await horario.destroy();
    return true;
  }

  async deleteByGrupo(idGrupo) {
    return await GrupoHorario.destroy({
      where: { id_grupo: idGrupo }
    });
  }
}

export default new GrupoHorarioRepository();

