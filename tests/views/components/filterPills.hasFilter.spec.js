import { shallowMount, createLocalVue } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';

import DateTimeRangeFilterPill from '@/views/components/DateTimeRangeFilterPill.vue';
import EnumFilterPill from '@/views/components/EnumFilterPill.vue';
import HashFilterPill from '@/views/components/HashFilterPill.vue';
import LabelFilterPill from '@/views/components/LabelFilterPill.vue';
import MultiSelectFilterPill from '@/views/components/MultiSelectFilterPill.vue';
import NumericRangeFilterPill from '@/views/components/NumericRangeFilterPill.vue';
import TextFilterPill from '@/views/components/TextFilterPill.vue';
import TextSearchFilterPill from '@/views/components/TextSearchFilterPill.vue';

// FilterPillDropdown declares `hasFilter` as a required Boolean. Every pill
// feeds that prop from a computed, and an `&&` chain yields the last falsy
// operand rather than a Boolean, so an unset filter used to hand it `null`.
// These cases assert the computed is strictly Boolean in both states.
const OPTIONS = [
  { text: 'Critical', value: 'critical' },
  { text: 'High', value: 'high' },
];

const PILLS = [
  {
    name: 'DateTimeRangeFilterPill',
    component: DateTimeRangeFilterPill,
    props: {},
    setValue: { since: '2024-01-01', before: null },
  },
  {
    name: 'NumericRangeFilterPill',
    component: NumericRangeFilterPill,
    props: { min: 0, max: 10 },
    setValue: { from: 7, to: null },
  },
  {
    name: 'MultiSelectFilterPill',
    component: MultiSelectFilterPill,
    props: { options: OPTIONS },
    unsetValue: [],
    setValue: ['critical'],
  },
  {
    name: 'TextSearchFilterPill',
    component: TextSearchFilterPill,
    props: { fields: [{ text: 'Name', value: 'name' }] },
    setValue: { fields: ['name'], value: 'log4j' },
  },
  {
    name: 'TextFilterPill',
    component: TextFilterPill,
    props: {},
    setValue: { operator: 'contains', value: 'log4j' },
  },
  {
    name: 'HashFilterPill',
    component: HashFilterPill,
    props: { hashTypes: [{ text: 'SHA-1', value: 'sha1' }] },
    setValue: { hashType: 'sha1', hash: 'abc123' },
  },
  {
    name: 'EnumFilterPill',
    component: EnumFilterPill,
    props: { options: OPTIONS },
    setValue: 'critical',
  },
  {
    name: 'LabelFilterPill',
    component: LabelFilterPill,
    props: {},
    setValue: { key: 'env', value: 'prod' },
  },
];

function mountPill(pill, value) {
  const localVue = createLocalVue();
  // Registers the b-* children so shallowMount stubs them out.
  localVue.use(BootstrapVue);

  return shallowMount(pill.component, {
    localVue,
    propsData: {
      fieldName: 'testField',
      fieldLabel: 'Test Field',
      ...pill.props,
      value,
    },
    mocks: {
      $t: (key) => key,
    },
  });
}

describe('filter pill hasFilter', () => {
  let consoleError;

  beforeEach(() => {
    // Vue reports failed prop type checks through console.error.
    consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleError.mockRestore();
  });

  describe.each(PILLS.map((pill) => [pill.name, pill]))('%s', (_name, pill) => {
    it('is strictly false when no filter is set', () => {
      const wrapper = mountPill(pill, pill.unsetValue ?? null);

      // toBe, not toBeFalsy: null would satisfy the latter and is the bug.
      expect(wrapper.vm.hasFilter).toBe(false);
    });

    it('is strictly true once a filter is set', () => {
      const wrapper = mountPill(pill, pill.setValue);

      expect(wrapper.vm.hasFilter).toBe(true);
    });

    // Reproduces the reported symptom:
    //   [Vue warn]: Invalid prop: type check failed for prop "hasFilter".
    //   Expected Boolean, got Null
    it('does not trip the dropdown prop type check when unset', () => {
      mountPill(pill, pill.unsetValue ?? null);

      const propWarnings = consoleError.mock.calls
        .map((args) => String(args[0]))
        .filter((message) => /Invalid prop|hasFilter/.test(message));

      expect(propWarnings).toEqual([]);
    });
  });
});
