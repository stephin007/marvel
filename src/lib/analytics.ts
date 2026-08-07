/** OpenPanel event names used across the site. */
export const AnalyticsEvent = {
  CtaExploreMap: "cta_explore_map",
  CtaHowToNavigate: "cta_how_to_navigate",
  MapLoaded: "map_loaded",
  MapLoadFailed: "map_load_failed",
  MapEnterGalaxy: "map_enter_galaxy",
  MapLeaveGalaxy: "map_leave_galaxy",
  MapSelectCharacter: "map_select_character",
  MapSearch: "map_search",
  MapToggleBridges: "map_toggle_bridges",
  MapToggleReveal: "map_toggle_reveal",
  MapResetLayout: "map_reset_layout",
} as const;

export type AnalyticsEventName =
  (typeof AnalyticsEvent)[keyof typeof AnalyticsEvent];
