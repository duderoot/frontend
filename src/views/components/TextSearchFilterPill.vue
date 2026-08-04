<template>
  <filter-pill-dropdown
    ref="pill"
    :field-name="fieldName"
    :field-label="fieldLabel"
    :icon="icon"
    :has-filter="hasFilter"
    @show="onDropdownShow"
    @hide="onDropdownHide"
    @clear="clearFilter"
    @dismiss="$emit('dismiss')"
  >
    <template #value>~ "{{ value.value }}"</template>

    <b-form-group class="mb-2">
      <b-form-input
        :id="`text-search-filter-pill-value-${fieldName}`"
        ref="valueInput"
        v-model="tmpValue"
        :placeholder="$t('message.search') + '...'"
        size="sm"
        @keyup.enter="applyFilter"
      ></b-form-input>
    </b-form-group>
    <b-form-group :label="$t('message.search_in')" label-size="sm" class="mb-2">
      <b-form-checkbox-group
        v-model="tmpFields"
        :options="fields"
        stacked
        size="sm"
      ></b-form-checkbox-group>
    </b-form-group>
    <div class="d-flex justify-content-end">
      <b-button
        variant="primary"
        size="sm"
        @click="applyFilter"
        :disabled="!tmpValue || tmpFields.length === 0"
        >{{ $t('message.apply') }}
      </b-button>
    </div>
  </filter-pill-dropdown>
</template>

<script>
import FilterPillDropdown from '@/views/components/FilterPillDropdown.vue';

export default {
  name: 'TextSearchFilterPill',
  components: { FilterPillDropdown },
  props: {
    fieldName: {
      type: String,
      required: true,
    },
    fieldLabel: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      default: null,
    },
    fields: {
      type: Array,
      required: true,
    },
    value: {
      type: Object,
      default: () => null,
    },
  },
  data() {
    return {
      tmpFields: this.allFieldValues(),
      tmpValue: '',
    };
  },
  watch: {
    value: {
      immediate: true,
      handler(val) {
        if (val && val.fields && val.value) {
          this.tmpFields = [...val.fields];
          this.tmpValue = val.value;
        } else {
          this.tmpFields = this.allFieldValues();
          this.tmpValue = '';
        }
      },
    },
  },
  computed: {
    hasFilter() {
      return !!(
        this.value &&
        this.value.fields &&
        this.value.fields.length > 0 &&
        this.value.value
      );
    },
  },
  methods: {
    allFieldValues() {
      return this.fields.map((f) => (typeof f === 'object' ? f.value : f));
    },
    onDropdownShow() {
      this.$nextTick(() => {
        if (this.$refs.valueInput) {
          this.$refs.valueInput.focus();
        }
      });
    },
    open() {
      this.$refs.pill.open();
    },
    onDropdownHide() {
      if (this.hasFilter) {
        this.tmpFields = [...this.value.fields];
        this.tmpValue = this.value.value;
      } else {
        this.tmpFields = this.allFieldValues();
        this.tmpValue = '';
      }
    },
    applyFilter() {
      const trimmed = this.tmpValue ? this.tmpValue.trim() : '';
      if (!trimmed || this.tmpFields.length === 0) return;
      this.$emit('input', {
        fields: [...this.tmpFields],
        value: trimmed,
      });
      this.$refs.pill.hide();
    },
    clearFilter() {
      this.tmpFields = this.allFieldValues();
      this.tmpValue = '';
      this.$refs.pill.hide();
      this.$emit('input', null);
    },
  },
};
</script>
