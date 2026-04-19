/**
 * Service detail heroes + homepage featured cards — `/public/services-images`.
 * Matches top six `SERVICE_CATEGORIES` keys (digital health uses telehealth elsewhere).
 */
const S = '/services-images';

export const SERVICE_CATEGORY_IMAGES = {
  pain_relief_physiotherapy: `${S}/high_quality_professional_lifestyle_photography_for_a_physiotherapy_service._a_focused_physiotherapist_in_a_modern_clean_clinic_setting_working_with_a_patient_on_a_treatment_table_performing_a_gentle_manual_therapy.png`,
  advanced_rehabilitation: `${S}/high_quality_professional_lifestyle_photography_for_an_advanced_rehabilitation_and_recovery_service._a_patient_working_with_a_specialist_in_a_high_tech_rehab_facility_with_modern_equipment._the_focus_is_on_a_succes.png`,
  nutrition_lifestyle: `${S}/high_quality_professional_lifestyle_photography_for_a_nutrition_and_lifestyle_coaching_service._a_beautiful_top_down_shot_of_a_healthy_vibrant_meal_like_a_nourish_bowl_with_fresh_vegetables_grains_and_protein_on_a_.png`,
  mental_wellness: `${S}/high_quality_professional_lifestyle_photography_for_mental_wellness_and_performance_care._a_peaceful_outdoor_scene_with_a_person_standing_in_a_meditative_pose_overlooking_a_calm_landscape_like_a_misty_mountain_or_a.png`,
  therapeutic_yoga: `${S}/high_quality_professional_lifestyle_photography_for_a_therapeutic_yoga_and_wellness_service._a_serene_spacious_studio_with_soft_natural_light._a_small_diverse_group_of_people_are_practicing_a_gentle_yoga_pose_with_.png`,
  /** Consultation / performance planning context */
  sports_performance: `${S}/high_quality_professional_lifestyle_photography_for_a_general_healthcare_and_wellness_consultation_service._a_warm_inviting_consultation_room_where_a_friendly_professional_is_talking_with_a_patient._the_focus_is_on.png`,
} as const;

/**
 * Homepage “Comprehensive Services” 2×2 cards — same lifestyle set as service detail heroes.
 */
export const FEATURED_SERVICE_CARDS = {
  painPhysio: SERVICE_CATEGORY_IMAGES.pain_relief_physiotherapy,
  advancedRehab: SERVICE_CATEGORY_IMAGES.advanced_rehabilitation,
  therapeuticYoga: SERVICE_CATEGORY_IMAGES.therapeutic_yoga,
  sportsPerformance: SERVICE_CATEGORY_IMAGES.sports_performance,
} as const;

/**
 * Shared hero/card imagery for H2H marketing UI.
 * Prefer local assets for physio/rehab/sports; avoid ambiguous stock “medical desk / anatomy” shots.
 */
export const MARKETING_IMAGES = {
  physio: '/our-excellence/phsio-image-akshat.jpeg',
  rehab: '/our-excellence/gym-image-akshat.jpeg',
  sports: '/our-excellence/football.jpg',
  /** SAI NCOE group session — matches Excellence grid imagery */
  yoga: '/our-excellence/sai-ncoe-yoga.png',
  /** Homepage hero full-bleed background */
  heroSectionBanner: '/hero-section-banner.png',
  /** Stay Connected section — consultation / support desk */
  contactUs: '/contact-us.png',
  /** Supervised exercise / active recovery (cardiac rehab, general fitness) */
  activeRecovery: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&h=600&fit=crop',
  athleteTraining: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop',
  yogaStudio: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=600&fit=crop',
  telehealth: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=600&fit=crop',
  nutrition: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&h=600&fit=crop',
  mentalWellness: 'https://images.unsplash.com/photo-1545389336-cf090694435e?w=800&h=600&fit=crop',
  /**
   * About page — “Trusted by Champions” wide banner.
   * Athletic training / performance context (Unsplash — fits sports rehab positioning).
   */
  aboutTrustedChampionsBanner:
    'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=1600&q=85&fit=crop&auto=format',
  /**
   * About “Our Mission” column — clinical / healthcare context (Unsplash).
   */
  aboutMissionHealthcare:
    'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=1200&q=85&fit=crop&auto=format',
  /**
   * About ground-team section — real photo of hands together (not a UI screenshot).
   */
  aboutGroundTeamHands:
    'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=800&h=600&fit=crop&q=80',
} as const;

const ABOUT = '/about-us';

/**
 * About page — four lifestyle shots in `public/about-us` (long `professional_lifestyle_*` filenames).
 * Optional `patient-first-care-handshake.jpg` is a shorter alias for the patient-first / handshake theme.
 */
export const ABOUT_PAGE_IMAGES = {
  patientFirstCareHandshakeJpg: `${ABOUT}/patient-first-care-handshake.jpg`,
  patientFirstCareCard:
    `${ABOUT}/professional_lifestyle_photography_for_a_patient_first_care_card._a_close_up_empathetic_shot_of_a_healthcare_provider_s_hand_on_a_patient_s_shoulder_or_a_warm_handshake_emphasizing_a_personal_and_personalized_conne.png`,
  expertCareHands:
    `${ABOUT}/professional_lifestyle_photography_for_a_expert_care_section._a_close_up_shot_of_a_healthcare_professional_s_hands_gently_adjusting_a_patient_s_posture_or_providing_guidance_emphasizing_precision_and_expertise._the.png`,
  homeVisitsWide:
    `${ABOUT}/professional_lifestyle_photography_for_a_home_visits_section._a_friendly_healthcare_professional_entering_a_bright_comfortable_and_modern_home_environment_greeted_warmly_by_a_patient._the_shot_is_wide_and_inviting_.png`,
  evidenceLedWorkspace:
    `${ABOUT}/professional_lifestyle_photography_for_an_evidence_led_care_section._a_modern_minimalist_workspace_with_a_tablet_or_laptop_displaying_clear_health_progress_charts_and_anatomical_diagrams._next_to_it_a_professional_.png`,
} as const;
