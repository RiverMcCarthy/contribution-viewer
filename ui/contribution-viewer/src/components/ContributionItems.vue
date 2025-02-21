<template>
  <div>
    <div class="search-container">
      <input
        type="text"
        v-model="searchQuery"
        placeholder="Search by title"
        class="search-input"
      />
      <button @click="clearSearch" class="clear-button">Clear</button>
      <button @click="searchContributions" class="search-button">Search</button>
    </div>
    <div class="contributions-container">
      <div
        v-for="contribution in contributions"
        :key="contribution.id"
        class="contribution-item"
      >
        <h3>{{ contribution.title }}</h3>
        <p>{{ contribution.description }}</p>
        <p><strong>Owner:</strong> {{ contribution.owner }}</p>
        <p><strong>Start Time:</strong> {{ new Date(contribution.startTime).toLocaleString() }}</p>
        <p><strong>End Time:</strong> {{ new Date(contribution.endTime).toLocaleString() }}</p>
        <p><strong>Status:</strong> {{ getStatus(contribution.startTime, contribution.endTime) }}</p>
      </div>
    </div>
    <div class="pagination-controls">
      <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1">Previous</button>
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages">Next</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ContributionItems',
  data() {
    return {
      contributions: [],
      searchQuery: '',
      currentPage: 1,
      itemsPerPage: 14,
      totalPages: 1,
      totalContributions: 0,
    };
  },
  mounted() {
    this.fetchContributions();
  },
  methods: {
    fetchContributions() {
      const params = new URLSearchParams();
      params.append('order_by','title');
      params.append('title', this.searchQuery);
      params.append('skip', (this.currentPage - 1) * this.itemsPerPage);
      params.append('limit', this.itemsPerPage);

      fetch(`/api/contributions?${params.toString()}`)
        .then(response => response.json())
        .then(data => {
          this.contributions = data.contributions;
          this.totalContributions = data.total;
          this.totalPages = Math.ceil(this.totalContributions / this.itemsPerPage);
        })
        .catch(error => {
          console.error('Error fetching contributions:', error);
        });
    },

    searchContributions() {
      this.currentPage = 1;
      this.fetchContributions();
    },

    clearSearch(){
      this.searchQuery = '';
      this.searchContributions();
    },

    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
        this.fetchContributions();
      }
    },

    getStatus(startTime, endTime) {
      const now = new Date();
      const start = new Date(startTime);
      const end = new Date(endTime);

      if (now < start) {
        return "Scheduled";
      } else if (now >= start && now <= end) {
        return "Active";
      } else {
        return "Complete";
      }
    }
  }
};
</script>

<style scoped>
.search-container {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.search-input {
  padding: 10px;
  width: 80%;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 16px;
}

.clear-button {
  padding: 10px 15px;
  background-color: #d52e2e;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.clear-button:hover {
  background-color: #b01c1c;
}

.search-button {
  padding: 10px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.search-button:hover {
  background-color: #0056b3;
}

.contributions-container {
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(3, 1fr);
}

.contribution-item {
  border: 1px solid #ddd;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  background-color: #f9f9f9;
}

.pagination-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
}

.pagination-controls button {
  padding: 5px 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.pagination-controls button:disabled {
  background-color: #ccc;
}

@media (max-width: 768px) {
  .contributions-container {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .contributions-container {
    grid-template-columns: 1fr;
  }
}
</style>
