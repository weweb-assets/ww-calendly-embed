<template>
  <div
    class="ww-calendly-embed"
    :class="{ editing: isEditing }"
    :key="componentKey"
  ></div>
</template>

<script>
export default {
  props: {
    content: { type: Object, required: true },
    /* wwEditor:start */
    wwEditorState: { type: Object, required: true },
    /* wwEditor:end */
  },
  emits: ["trigger-event"],
  data() {
    return {
      componentKey: 0,
    };
  },
  watch: {
    content: {
      deep: true,
      handler() {
        if (window.Calendly) {
          this.componentKey += 1;
          this.$nextTick(() => window.Calendly.initInlineWidget(this.settings));
        }
      },
    },
  },
  computed: {
    isEditing() {
      /* wwEditor:start */
      return (
        this.wwEditorState.editMode === wwLib.wwEditorHelper.EDIT_MODES.EDITION
      );
      /* wwEditor:end */
      // eslint-disable-next-line no-unreachable
      return false;
    },
    settings() {
      const settings = {
        url: `https://calendly.com/${this.content.id}?hide_landing_page_details=1&hide_gdpr_banner=1`,
        parentElement: this.$el,
      };

      const prefill = {
        name: this.content.prefillName,
        email: this.content.prefillMail,
      };

      return this.content.prefillOptions ? { ...settings, prefill } : settings;
    },
  },
  methods: {
    isCalendlyEvent(e) {
      return (
        e.origin === "https://calendly.com" &&
        e.data.event &&
        e.data.event.indexOf("calendly.") === 0
      );
    },
    eventHandlers(e) {
      if (this.isCalendlyEvent(e)) {
        switch (e.data.event) {
          case "calendly.date_and_time_selected":
            this.$emit("trigger-event", { name: "dateAndTime" });
            break;
          case "calendly.event_scheduled":
            this.$emit("trigger-event", { name: "booked" });
            break;
          default:
            break;
        }
      }
    },
  },
  mounted() {
    const doc = wwLib.getFrontDocument();
    const isScript = !!doc.querySelector("[data-name='calendly-script']");

    if (!isScript) {
      const script = document.createElement("script");
      script.setAttribute("data-name", "calendly-script");
      script.setAttribute("type", "text/javascript");
      script.setAttribute(
        "src",
        "https://assets.calendly.com/assets/external/widget.js"
      );
      script.setAttribute("async", true);
      doc.body.appendChild(script);
    }

    window.addEventListener("message", (e) => this.eventHandlers(e));
  },
  beforeUnmount() {
    window.removeEventListener("message", (e) => this.eventHandlers(e));
  },
};
</script>

<style lang="scss" scoped>
.ww-calendly-embed {
  &.editing {
    pointer-events: none;
  }
}
</style>
