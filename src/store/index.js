import { createStore } from 'vuex';

export default createStore({
    state: {
        darkTheme: false,
        employees: [],
        lastDeletedEmployee: null,
    },
    getters: {
        getEmployees: (state) => state.employees,
        isDarkTheme: (state) => state.darkTheme,
    },
    mutations: {
        addEmployee(state, employee) {
            // Generate a random ID for the employee (for simplicity, you can use a proper ID generation method in a real app)
            employee.id = Math.random().toString(36).substr(2, 9);
            state.employees.push(employee);
        },
        updateEmployeeStatus(state, { employeeId, newStatus }) {
            const employeeToUpdate = state.employees.find((emp) => emp.id === employeeId);
            if (employeeToUpdate) {
                employeeToUpdate.status = newStatus;
            }
            localStorage.setItem('employees', JSON.stringify(state.employees));
        },

        updateEmployee(state, updatedEmployee) {
            // Find the index of the employee to be updated
            const employeeIndex = state.employees.findIndex(
                (employee) => employee.id === updatedEmployee.id
            );

            // Update the employee details in the state
            if (employeeIndex !== -1) {
                state.employees[employeeIndex] = updatedEmployee;
            }

            // Save the updated employee list to local storage
            localStorage.setItem('employees', JSON.stringify(state.employees));
        },
        setNotification(state, notification) {
            state.notification = notification;
        },
        // Save the theme preference in localStorage
        toggleTheme(state) {
            state.darkTheme = !state.darkTheme;
            localStorage.setItem('darkTheme', state.darkTheme);
        },
        updateLocalStorage(state) {
            localStorage.setItem('employees', JSON.stringify(state.employees));
        },
        initializeStore(state) {
            const storedEmployees = localStorage.getItem('employees');
            if (storedEmployees) {
                state.employees = JSON.parse(storedEmployees);
            }

            const darkTheme = localStorage.getItem('darkTheme');
            if (darkTheme !== null) {
                state.darkTheme = JSON.parse(darkTheme);
            }
        },
        deleteEmployee(state, employeeId) {
            const index = state.employees.findIndex((employee) => employee.id === employeeId);
            if (index !== -1) {
                state.lastDeletedEmployee = state.employees[index]; // Store the last deleted employee
                state.employees.splice(index, 1);
                localStorage.setItem('employees', JSON.stringify(state.employees));
            }
        },
        undoDeleteEmployee(state) {
            if (state.lastDeletedEmployee) {
                state.employees.push(state.lastDeletedEmployee);
                state.lastDeletedEmployee = null; // Clear the lastDeletedEmployee after undo
                localStorage.setItem('employees', JSON.stringify(state.employees));
            }
        },
    },
    actions: {
        saveEmployee({ commit, dispatch }, employee) {
            commit('addEmployee', employee);
            commit('updateLocalStorage');
            dispatch('notifyEmployeeSaved', employee);
        },
        toggleTheme({ commit }) {
            commit('toggleTheme');
        },
        // Optional: Add a notification or message for successful save
        notifyEmployeeSaved({ commit }, employee) {
            const notification = `Employee "${employee.displayName}" has been successfully saved.`;
            commit('setNotification', notification);
            setTimeout(() => {
                commit('setNotification', null);
            }, 5000);
        },
        deleteEmployee({ commit, state }, employeeId) {
            commit('deleteEmployee', employeeId);
            // If you want to show a notification after deletion, you can do it here:
            const deletedEmployee = state.employees.find((employee) => employee.id === employeeId);
            if (deletedEmployee) {
                const notification = `Employee "${deletedEmployee.displayName}" has been deleted.`;
                commit('setNotification', notification);
                setTimeout(() => {
                    commit('setNotification', null);
                }, 5000);
            }
        },

        undoDeleteEmployee({ commit }) {
            commit('undoDeleteEmployee');
        },

    },
});