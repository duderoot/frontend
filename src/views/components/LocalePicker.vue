<template>
  <b-input-group>
    <b-input-group-prepend :title="this.$t('message.language')" is-text>
      <span class="fa fa-language text-primary"></span>
    </b-input-group-prepend>
    <b-form-select
      class="bg-widget"
      v-model="selectedItem"
      @change="onLocaleSelected"
    >
      <b-form-select-option
        v-for="locale in $i18n.availableLocales"
        :key="`locale-${locale}`"
        :value="locale"
        :title="$t(`language.${locale}`)"
      >
        <span class="mr-2">{{ localeToFlag(locale) }}</span>
        {{ locale.toUpperCase() }}
      </b-form-select-option>
    </b-form-select>
  </b-input-group>
</template>

<script>
import { localeToFlagEmoji } from '@/shared/localeFlag';

export default {
  data() {
    return {
      selectedItem: null,
    };
  },
  beforeMount() {
    this.selectedItem = this.$i18n.locale;
  },
  methods: {
    onLocaleSelected: function (value) {
      localStorage.setItem('Locale', value);
      this.$i18n.locale = value;

      // NB: As of DT v4.11, not all UI elements are updated automatically
      // when the locale is changed. We force a page reload to work around
      // this, but it really is a crutch that should be replaced with a proper
      // solution in the future.
      this.$router.go(0);
    },
    localeToFlag: localeToFlagEmoji,
  },
};
</script>
