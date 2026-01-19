/**
 * weights.js
 * ----------
 * Define los pesos de cada dimensión de riesgo
 * según el tipo de perfil evaluado.
 *
 * Estos pesos determinan cómo se pondera la matriz de riesgo
 * para obtener el score final.
 */

const PROFILE_WEIGHTS = {
  /**
   * Perfil privado
   * Exposición limitada, foco en suplantación y urgencia.
   */
  private: {
    impersonation: 0.30,
    reputation: 0.20,
    impact: 0.10,
    urgency: 0.40
  },

  /**
   * Profesional independiente
   * Balance entre reputación, impacto y suplantación.
   */
  professional: {
    impersonation: 0.25,
    reputation: 0.30,
    impact: 0.25,
    urgency: 0.20
  },

  /**
   * Marca / empresa
   * Reputación e impacto económico dominan.
   */
  brand: {
    impersonation: 0.20,
    reputation: 0.40,
    impact: 0.30,
    urgency: 0.10
  },


  public_sensitive: {
    impersonation: 0.15,
    reputation: 0.45,
    impact: 0.30,
    urgency: 0.10
  }
};

module.exports = {
  PROFILE_WEIGHTS
};
