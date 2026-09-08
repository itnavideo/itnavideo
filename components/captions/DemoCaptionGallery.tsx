'use client';

const CLOUD = 'dhouh9idx';
const BASE = `https://res.cloudinary.com/${CLOUD}/video/upload`;

const AUTO_CAPTION_VIDEOS = [
  'You_re_already_ahead_in_something.Stop_ignoring_it._That_s_your_edge._personalbranding_mhjtvu',
  'When_the_convenience_fee_starts_feeling_less_convenient.___️_acting_newera_relatableree_hz60i3',
  'The_environment_you_re_in_is_either_building_your_wealth_or_quietly_dismantling_it._Most_people_fprm6m',
  'Can_a_profitable_company_go_bankrupt_Yes_it_is_possible..You_can_be_making_profit_on_paper_b_jewqie',
  'OpenAl_just_dropped_GPT_5.6_with_three_models_Sol_Terra_and_Luna._Sol_outperforms_Mythos_5_on_vyzfy8',
  'I_filed_for_divorce_closed_a_billion-dollar_company_and_moved_to_a_country_where_I_didn_t_spea_tm9yqa',
  'How_to_deal_with_discount_clients_businesswomen_businessowners_businessowner_discount_eve_u0d2xi',
  'Are_you_in_the_right_rooms_fppoam',
  'Comment_ADVANTAGE_to_get_the_4_skills_that_give_you_the_upper_hand_on_wealth_while_everyone_el_nqbpyj',
  'Ask_yourself_this_question.Are_you_regretting_your_mistakes..._or_learning_from_them_️_d9ekcx',
  'AQPVA3o0gznenuUQiwhNDophXWiYiUQYH1yapOVHuRbd4MY5OM-39iNeazaUYwLHw_WjFm-3t9DFafPuI3Ut_S9zkhusTYvE_ypbbvm',
  'affirmationsong_affirmations_womenssecretway_dailyreminders_loveyourselfquotes_hquhqx',
  'She_remembered_who_she_was_and_the_game_changed._Lalah_DeliaS_A_V_E_this_reel_to_revisit_lat_oomrus',
  'content-creator-after',
  'doctor-after',
  'professional-creator-after',
  'professional-creator-girl-after',
  'real-estate-advisor-after',
  'traveler-after',
];

const COMPARE_VIDEOS = [
  'Whats_the_difference_fyp_didyouknow_englishvocabulary_viralreels_explorepage_1_gkznkt',
  'Whats_The_Difference_Between_Coding_And_Programming._coding_programming_software_development_uf7fvf',
  'Whats_the_difference_coupon_voucher_difference_englishtips_englishlesson_qw4kve',
  'What_s_the_difference._IIT_vs_ITI_JEE_vs_NEET__Kya_aapko_bhi_in_terms_ke_beech_ka_asli_farq_pa_bflieg',
  'UPSC_vs_PCS_Kaun_Hai_Asli_Boss....._upsc_ssc_knowledge_exploremore_fypage_adecyc',
  'Indian_Government_Departments_Explained_in_Simple_Words....._indiafacts_education_viralree_hciuyx',
  'Fixed_account_vs_Current_account_..._instagood_fd_viral_savings_finance_egsc7j',
  'Did_you_know_difference_Between_Coaches_g3rabm',
  'Defference_between_Passport_And_Visa_viral_education_stickman_viralreels_passport_lpegjb',
  'Debit_Card_vs_Credit_Card....Whats_the_difference_Salary_vs_Wage_-_Inflation_vs_Recession...._utbxea',
  'DAILY_KNOWLEDGE_--_EP_13_education_knowledge_explorepage_fact_smart_npziqq',
  'Dajjal_aur_Yajooj_Majooj_ka_Khauf_️_Rajesh_Machis_aur_Kaka_par_sabse_bada_imtihan_Is_Stickm_urc27o',
  '90_People_Confuse_These_Two_learnenglish_difference_trendingreel_english_wzaslb',
  'What_should_I_explain_next_Comment_below_Follow_stickboyexplains_for_daily_tech_content._T_lkhjyn',
  'Bilkul_Agar_aap_Windows_vs_MacBook_reel_ke_liye_isi_style_ka_caption_chahte_hain_to_ye_use_kar_jz5y8g',
  'सरकारी_Bank_और_Private_Bank_में_क्या_फर्क_है_क्या_Government_Bank_और_Private_Bank_एक_जैसे_ह_jexa9v',
];

const TYPOGRAPHY_VIDEOS = [
  'Walking_into_new_territory_is_all_about_asking_the_right_questions_And_of_course_collaborating_dxwggb',
  'The_different_between_dreaming_and_building_ain_t_talent._It_s_taking-_action_consistency_and_uk6mov',
  'Slow_down_to_be_taken_seriously.When_you_rush_people_struggle_to_keep_up.And_when_others_have_t_c2zbay',
  'Radhika_Ambani_shares_why_financial_independence_is_essential_for_women_noting_that_a_woman_s_i_ihpstq',
  'Our_brains_are_wired_to_pick_up_routine_Manifestation_is_REAL_so_act_like_the_person_you_want_yftrgm',
  'Not_everyone_will_clap_when_you_grow_But_that_should_never_stop_you_Keep_growing._Keep_worki_wlb9al',
  'Most_of_what_we_call_luck_is_the_visible_outcome_of_someone_staying_in_the_game_longer_than_ot_xy8vgx',
  '4_types_of_leverage-1-_labour_-_lowest_leverage._slow_to_scale_as_a_business_owner_and_increases_ds8nec',
  'Discipline_today_is_freedom_tomorrow._️My_team_and_I_will_coach_week_by_week_through_the_right_hly36n',
  'An_extraordinary_network_isn_t_built_by_simply_introducing_yourself._It_s_built_through_consiste_ztw9ua',
];

export { AUTO_CAPTION_VIDEOS, COMPARE_VIDEOS, TYPOGRAPHY_VIDEOS };

function VideoCard({ publicId }: { publicId: string }) {
  return (
    <div className="group relative aspect-[9/16] overflow-hidden rounded-xl border border-white/8 bg-black shadow-lg transition hover:border-emerald-400/30 hover:shadow-emerald-500/10">
      <video
        src={`${BASE}/${publicId}.mp4`}
        className="absolute inset-0 h-full w-full object-cover"
        muted
        playsInline
        loop
        preload="metadata"
        onMouseEnter={(e) => (e.target as HTMLVideoElement).play()}
        onMouseLeave={(e) => { const v = e.target as HTMLVideoElement; v.pause(); v.currentTime = 0; }}
        onClick={(e) => { const v = e.target as HTMLVideoElement; v.paused ? v.play() : v.pause(); }}
      />
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-100 transition-opacity group-hover:opacity-0">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black/50 backdrop-blur-sm border border-white/10">
          <div className="ml-0.5 h-0 w-0 border-l-[10px] border-t-[6px] border-b-[6px] border-l-white border-t-transparent border-b-transparent" />
        </div>
      </div>
    </div>
  );
}

export function DemoVideoGrid({ videos, title, subtitle, accent = '#22C55E' }: { videos: string[]; title: string; subtitle: string; accent?: string }) {
  return (
    <section className="px-4 pb-20 sm:px-6" style={{ background: '#080C14' }}>
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-center">
          <p className="mb-3 text-xs font-black uppercase tracking-[0.2em]" style={{ color: accent }}>Real output examples</p>
          <h2 className="text-3xl font-black text-white sm:text-4xl">{title}</h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-slate-400">{subtitle}</p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {videos.map((id) => (
            <VideoCard key={id} publicId={id} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function DemoCaptionGallery() {
  return (
    <DemoVideoGrid
      videos={AUTO_CAPTION_VIDEOS}
      title="See what creators are making"
      subtitle="Real videos with AI captions. Hover or tap to play."
      accent="#22C55E"
    />
  );
}
