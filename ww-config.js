export default {
  editor: {
    label: {
      en: "Calendly embed",
    },
  },
  triggerEvents: [
    { name: "dateAndTime", label: { en: "Invitee selected date and time" } },
    { name: "booked", label: { en: "Invitee successfully booked a meeting" } },
  ],
  properties: {
    id: {
      bindable: true,
      label: {
        en: "Calendly id",
      },
      type: "Text",
      options: {
        placeholder: "ricksanchez",
      },
      section: "settings",
    },
    prefillOptions: {
      type: "OnOff",
      label: {
        en: "Pre-fill options",
      },
      defaultValue: false,
      section: "settings",
    },
    prefillName: {
      hidden: (content) => !content.prefillOptions,
      bindable: true,
      label: {
        en: "Name",
      },
      type: "Text",
      options: {
        placeholder: "Rick sanchez",
      },
      section: "settings",
    },
    prefillMail: {
      hidden: (content) => !content.prefillOptions,
      bindable: true,
      label: {
        en: "Email",
      },
      type: "Text",
      options: {
        placeholder: "rick@sanchez.pickle",
      },
      section: "settings",
    },
  },
};
