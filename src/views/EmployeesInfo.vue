<template>
  <div class="container-fluid">
    <div class="pageWraper themeBox">
      <header>
        <div class="headerInnner">
          <div class="headerLeft">
            <span>Employee Master </span>
          </div>

          <div class="headerRight"  @click="toggleTheme">
            <span>Switch Themes </span>
            <span class="switchIcon">
              <img
                src="../assets/images/left/lightMoon.png"
                alt="link image" v-if="!darkTheme"
              />
              <img
                src="../assets/images/left/darkMoon.png"
                alt="link image" v-else
              />
            </span>
          </div>
        </div>
      </header>


      <div class="mainContaint">
        <div class="mainData">
          <div class="container-fluid">
            <div class="row">
              <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                <div class="themeCard">
                  <div class="themeCardHeader">
                    <div class="cardTitle">
                      <span class="cadrTitleTxt">Employee Info </span>
                    </div>
                    <div class="cardControll" @click="onEdit">
                      <span>
                        <img
                          src="../assets/images/left/EditIcon1.png"
                          alt="link image"
                        />
                      </span>
                      <span class="edit">Edit </span>
                    </div>
                  </div>

                  <div class="themeCardBody">
                    <div class="form-group">
                      <input
                        type="text"
                        class="form-control"
                        placeholder="Display Name"
                        v-model="displayName"
                        :readonly="readOnly"
                      />
                      <!-- <div class="error-message text-left text-danger" v-if="displayNameError">{{ displayNameError }}</div> -->
                    </div>
                    <div class="form-group">
                      <input
                        type="email"
                        class="form-control"
                        placeholder="Login ID"
                        v-model="loginId"
                        :readonly="readOnly"
                      />
                      <!-- <div class="error-message text-left text-danger" v-if="loginIdError">{{ loginIdError }}</div> -->
                      
                    </div>
                    <div class="form-group">
                      <input
                        class="form-control"
                        placeholder="Password"
                        v-model="password"
                        :readonly="readOnly"
                        :type="showPassword ? 'text' : 'password'"
                      />
                      <span
                        class="eye-icon"
                        :class="{ disabled: readOnly }"
                        @click="togglePasswordVisibility"
                      >
                        <i v-if="showPassword" class="fa fa-eye"></i>
                        <i v-else class="fa fa-eye-slash"></i>
                      </span>
                      
                      <!-- <div class="error-message text-left text-danger" v-if="passwordError">{{ passwordError }}</div> -->
                    </div>

                    <div class="switchRow">
                      <div class="switchLeft">Status</div>
                      <div class="switchRight">
                        <!-- Checkbox for "Active" status -->
                        <label>
                          <input
                            class="toggle-checkbox"
                            type="checkbox"
                            v-model="status"
                            :disabled="readOnly"
                          />
                          <div class="toggle-switch"></div>
                          <span class="toggle-label">{{
                            status ? "Active" : "Inactive"
                          }}</span>
                        </label>
                       
                      </div>
                    </div>

                    <div class="saveBtnRow" :class="{ disabled: readOnly }">
                      <a @click="saveEmployee" class="saveBtn">Save </a>
                    </div>
                    <div v-if="lastDeletedEmployee" class="undoBtn" @click="undoDelete">
                      Undo Delete {{ lastDeletedEmployee.displayName }}
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                <div class="themeCard">
                  <div class="themeCardHeader">
                    <div class="cardTitle">
                      <span class="cadrTitleTxt">View Employee ({{ filteredEmployees.length }}) </span>
                    </div>
                    <div class="cardControll">
                      <input type="search" v-model="searchText" @input="filterEmployees" placeholder="Search"/>
                    </div>
                  </div>

                  <div class="themeCardBody">
                    <div class="employeeListBox">
                      <ul>
                        <li v-for="employee in filteredEmployees" :key="employee.id">
                          <div class="EListWrap">
                            <div class="EListLeft">
                              <!-- You can customize the image and alt text if required -->
                              <span class="EmpPic">
                                <img
                                  src="../assets/images/left/pro.png"
                                  alt="Profile Picture"
                                />
                              </span>
                            <div>
                              <span class="empName">{{
                                employee.displayName
                              }}</span>
                              <br>
                              <span style="font-size: 12px;">{{ employee.loginId }}</span>
                            </div>
                            </div>
                            <div class="EListRight">
                              <a
                                class="ListViewBtn"
                                @click="showEmployeeDetails(employee)"
                                ><i class="fa fa-eye"></i></a
                              >
                              <a
                                class="ListViewBtn"
                                @click="deleteEmployee(employee)"
                                ><i class="fa fa-trash-o"></i></a
                              >
                            </div>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
export default {
  data() {
    return {
      displayName: "",
      loginId: "",
      password: "",
      status: "active",
      selectedEmployee: null,
      readOnly: false,
      showPassword: false,
      searchText: "",

    };
  },
  computed: {
    ...mapState(['darkTheme', 'lastDeletedEmployee']),
    employees() {
      return this.$store.getters.getEmployees;
    },
    filteredEmployees() {
      return this.filterEmployees(this.searchText);
    },
  },
  methods: {
    ...mapActions(['saveEmployee','toggleTheme','undoDeleteEmployee']),
    // Prepare employee object with entered details
    async saveEmployee() {
    // Prepare employee object with entered details
    const employee = {
      displayName: this.displayName,
      loginId: this.loginId,
      password: this.password,
      status: this.status,
    };

    if (this.selectedEmployee) {
      // If a selectedEmployee exists, update the existing employee
      employee.id = this.selectedEmployee.id; // Set the same ID to update the existing employee
      this.$store.commit('updateEmployee', employee);
    } else {
      // If there is no selectedEmployee, add a new employee
      await this.$store.dispatch('saveEmployee', employee);
    }

    // Clear the input fields and enter view mode after saving
    this.displayName = '';
    this.loginId = '';
    this.password = '';
    this.status = '';
    this.selectedEmployee = null;
    this.readOnly = false; // Set readOnly back to false to disable editing
  },
    // ... (the rest of your component methods) ...
  
    // Set the selectedEmployee property to the clicked employee
    showEmployeeDetails(employee) {
      this.selectedEmployee = employee;
      this.displayName = employee.displayName;
      this.loginId = employee.loginId;
      this.password = employee.password;
      this.status = employee.status;
      this.readOnly = true;
    },
    onEdit() {
      this.readOnly = false;
    },
     // Toggle the showPassword flag to show/hide the password
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
    filterEmployees(searchQuery) {
      if (!searchQuery || typeof searchQuery !== 'string') {
        return this.employees;
      }

      const sanitizedQuery = searchQuery.trim().toLowerCase();
      return this.employees.filter((employee) => {
        const displayNameMatches = employee.displayName.toLowerCase().includes(sanitizedQuery);
        const loginIdMatches = employee.loginId.toLowerCase().includes(sanitizedQuery);
        return displayNameMatches || loginIdMatches;
      });
    },
    deleteEmployee(employee) {
    // Call the Vuex action to delete the employee
    this.$store.dispatch('deleteEmployee', employee.id);

    // Reset the selectedEmployee and input fields after deletion
    this.selectedEmployee = null;
    this.displayName = '';
    this.loginId = '';
    this.password = '';
    this.status = '';
  },
  undoDelete() {
      this.undoDeleteEmployee();
    },
  },
  created() {
    // Initialize the Vuex store with data from local storage on component creation
    this.$store.commit("initializeStore");
  },
};
</script>

<style></style>
