exports.findAll = async () => {
  return [
    { id: 1, foster_user_id: 1, animal_id: 1, assignment_id: 1, logged_at: "February 11, 2026 13:10:00", category: "meds", general_notes: "general note", behavior_notes: "behavior note", medicine_id: 1, qty_administered: 1.5, dose: "1 mg", administered_at: "February 11, 2026", prescription: "medication", documents: "https://supabase.com/document.pdf"  },
    { id: 2, foster_user_id: 2, animal_id: 2, assignment_id: 2, logged_at: "February 12, 2026 14:15:30", category: "meds", general_notes: "general note", behavior_notes: "behavior note", medicine_id: 1, qty_administered: 1.5, dose: "1 mg", administered_at: "February 12, 2026", prescription: "medication", documents: "https://supabase.com/document.pdf"  }
  ];
};