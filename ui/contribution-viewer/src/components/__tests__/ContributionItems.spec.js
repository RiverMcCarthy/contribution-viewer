import { mount } from '@vue/test-utils';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import ContributionItems from '../ContributionItems.vue';

global.fetch = vi.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({
      contributions: [
        {
          id: 1,
          title: "Contribution Title 1",
          description: "Contribution description 1.",
          startTime: "2025-02-20T18:00:00Z",
          endTime: "2025-02-20T18:30:00Z",
          owner: "Test Owner 1",
        },
        {
            id: 2,
            title: "Contribution Title 2",
            description: "Contribution description 2.",
            startTime: "2025-02-20T18:00:00Z",
            endTime: "2025-02-20T18:30:00Z",
            owner: "Test Owner 2",
          },
      ],
      total: 1,
    }),
  })
);

describe('ContributionItems.vue', () => {
  let wrapper;

  beforeEach(async () => {
    wrapper = mount(ContributionItems);
    await wrapper.vm.$nextTick();
  });

  it('renders contributions correctly', async () => {
    await wrapper.vm.$nextTick();
    expect(wrapper.text()).toContain('Contribution Title');
    expect(wrapper.text()).toContain('Contribution description');
  });

  it('fetches contributions on mounted', async () => {
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/contributions')
    );

    await wrapper.vm.$nextTick();
    expect(wrapper.vm.contributions.length).toBe(2);
    expect(wrapper.vm.contributions[0].title).toBe('Contribution Title 1');
    expect(wrapper.vm.contributions[1].title).toBe('Contribution Title 2');
  });

  it('updates the search query', async () => {
    await wrapper.find('.search-input').setValue('test');
    
    expect(wrapper.vm.searchQuery).toBe('test');
  });

  it('searches contributions when search button is clicked', async () => {
    await wrapper.find('.search-button').trigger('click');

    await wrapper.vm.$nextTick();

    expect(wrapper.vm.contributions.length).toBe(2);
  });

  it('clears the search query when clear button is clicked', async () => {
    await wrapper.find('.search-input').setValue('test');
    
    await wrapper.find('.clear-button').trigger('click');
    
    expect(wrapper.vm.searchQuery).toBe('');
    
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.contributions.length).toBe(2);
  });

  it('handles pagination correctly', async () => {
    wrapper.vm.totalContributions = 50;
    wrapper.vm.totalPages = Math.ceil(wrapper.vm.totalContributions / wrapper.vm.itemsPerPage);
    await wrapper.vm.fetchContributions();
    
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.currentPage).toBe(1);

    await wrapper.find('.pagination-controls button:last-child').trigger('click');
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.currentPage).toBe(2);
  });

  it('calculates contribution status correctly', () => {
    const startTime = '2025-02-20T18:00:00Z';
    const endTime = '2025-02-20T18:30:00Z';
    
    expect(wrapper.vm.getStatus(startTime, endTime)).toBe('Complete');
  });
});