import db from '../models/index.js';

const { GrupoHorario, Grupo } = db;

class GrupoHorarioRepository {
  async findAll() {
    return await GrupoHorario.findAll({
      where: { estado: 1 },
      include: [
        {
          model: Grupo,
          as: 'grupo',
          where: { estado: 1 },
          attributes: ['id_grupo', 'nombre', 'cupo_maximo', 'estado'],
          required: false
        }
      ],
      order: [['dia_semana', 'ASC'], ['hora_inicio', 'ASC']]
    });
  }

  async findById(id) {
    return await GrupoHorario.findOne({
      where: { id_grupo_horario: id, estado: 1 },
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
        activo: 1,
        estado: 1
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
        activo: 1,
        estado: 1
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
    const horario = await GrupoHorario.findOne({ where: { id_grupo_horario: id, estado: 1 } });
    if (!horario) {
      return null;
    }
    return await horario.update(data);
  }

  async delete(id) {
    const horario = await GrupoHorario.findOne({ where: { id_grupo_horario: id, estado: 1 } });
    if (!horario) {
      return false;
    }
    await horario.update({ estado: 0, eliminado_en: new Date() });
    return true;
  }

  async deleteByGrupo(idGrupo) {
    return await GrupoHorario.update(
      { estado: 0, eliminado_en: new Date() },
      { where: { id_grupo: idGrupo, estado: 1 } }
    );
  }
}

export default new GrupoHorarioRepository();

