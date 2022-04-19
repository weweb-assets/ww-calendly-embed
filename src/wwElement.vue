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
        if (window.__WW_IS_PRERENDER__) return;
        if (!this.isUrlValid) return;

        if (wwLib.getFrontWindow().Calendly) {
          this.componentKey += 1;
          this.$nextTick(() =>
            wwLib.getFrontWindow().Calendly.initInlineWidget(this.settings)
          );
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
        url: `${this.content.url}?hide_landing_page_details=1&hide_gdpr_banner=1`,
        parentElement: this.$el,
      };

      const prefill = {
        name: this.content.prefillName,
        email: this.content.prefillMail,
      };

      return this.content.prefillOptions ? { ...settings, prefill } : settings;
    },
    isUrlValid() {
      const expression =
        /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;
      const regex = new RegExp(expression);

      return this.content.url.match(regex);
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
    if (window.__WW_IS_PRERENDER__) return;

    const doc = wwLib.getFrontDocument();
    let script = doc.querySelector("[data-name='calendly-script']");
    const isScript = !!script;

    if (!isScript) {
      script = doc.createElement("script");
      script.setAttribute("data-name", "calendly-script");
      script.setAttribute("type", "text/javascript");
      script.setAttribute(
        "src",
        "https://assets.calendly.com/assets/external/widget.js"
      );
      script.setAttribute("async", true);
      doc.body.appendChild(script);
    }

    script.addEventListener("load", () => {
      if (!this.isUrlValid) return;
      this.$nextTick(() =>
        wwLib.getFrontWindow().Calendly.initInlineWidget(this.settings)
      );
    });

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
