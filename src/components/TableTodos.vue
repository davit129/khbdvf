<template>
  <v-app>
    <!-- Input field -->
    <div class="inpDiv">
      <input class="inp" type="number" v-model="userId" placeholder="User ID" />
      <input
        class="inp"
        type="number"
        v-model="quantity"
        placeholder="Quantity"
      />
      <v-btn @click="getData">Search</v-btn>
    </div>

    <!-- All data table items -->
    <v-data-table
      :headers="headers"
      :items="items"
      :items-per-page="5"
      :single-expand="singleExpand"
      :expanded.sync="expanded"
      show-expand
      @click:row="edit"
      class="elevation-1"
    >
      <!-- New item -->
      <template v-slot:top>
        <v-toolbar flat>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="green" dark class="mb-2" v-bind="attrs" v-on="on">
                New Item
              </v-btn>
            </template>

            <!-- Creating new todos -->
            <v-card>
              <v-card-title>
                <span class="text-h5">{{ formTitle }}</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="userId"
                        label="User Id"
                        type="number"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="id"
                        label="Id"
                        type="number"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="username"
                        label="Username"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="email"
                        label="Email"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="title"
                        label="Title"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close">
                  Cancel
                </v-btn>
                <v-btn color="blue darken-1" text @click="createTodo">
                  Save
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>

      <!-- Info about table row -->
      <template v-slot:expanded-item="{ headers, item }">
        <td :colspan="headers.length">{{ item }}</td>
      </template>

      <!-- Delete and Edit buttons -->
      <template #[`item.actions`]>
        <v-card-actions>
          <v-btn color="dark" big @click="editItem()">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn color="dark" dark small @click="deleteItem()">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </v-card-actions>
      </template>
    </v-data-table>
  </v-app>
</template>

<script>
import axios from "axios";
export default {
  // All data
  data: () => ({
    editableTodo: null,
    editTodos: null,
    dialog: false,
    editDialog: null,
    dialogDelete: null,
    userId: null,
    id: null,
    username: null,
    email: null,
    title: null,
    quantity: null,
    items: [],
    expanded: [],
    singleExpand: false,
    headers: [
      { text: "User ID", align: "left", sortable: true, value: "userId" },
      { text: "ID", align: "left", sortable: true, value: "id" },
      { text: "User Name", align: "left", sortable: true, value: "username" },
      { text: "Email", align: "left", sortable: true, value: "email" },
      { text: "Title", align: "left", sortable: true, value: "title" },
      { text: "Actions", value: "actions", sortable: false },
    ],
    editedIndex: -1,
    editedItem: {},
    defaultItem: {
      userId: "",
      id: "",
      username: "",
      email: "",
      title: "",
    },
  }),

  // Rendering the data to Local
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Item" : "Edit Item";
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },

  created() {
    this.getData();
  },

  // Calling function "getData()"
  mounted() {
    this.getData();
  },
  methods: {
    // Get the result of APIs
    async getData() {
      try {
        const Todos = await axios.get(
          "https://jsonplaceholder.typicode.com/todos"
        );
        const Users = await axios.get(
          "https://jsonplaceholder.typicode.com/users"
        );
        const todos = Todos.data;
        const users = Users.data;

        let filteredTodos = todos;
        if (this.userId !== null) {
          filteredTodos = filteredTodos.filter(
            (todo) => todo.userId === parseInt(this.userId)
          );
        }
        if (this.quantity !== null) {
          const quantity = parseInt(this.quantity);
          filteredTodos = filteredTodos.slice(0, quantity);
        }
        const mappedData = filteredTodos.map((todo) => {
          const user = users.find((user) => user.id === todo.userId);
          return {
            userId: todo.userId,
            title: todo.title,
            username: user.username,
            id: todo.id,
            email: user.email,
          };
        });
        this.items = mappedData;
      } catch (error) {
        console.log(error);
      }
      this.quantityToZero();
    },

    // Function "Create Todos"
    createTodo() {
      const newTodo = {
        id: this.id,
        title: this.title,
        userId: this.userId,
        username: this.username,
        email: this.email,
      };
      this.items.push(newTodo);
      this.close();
    },

    // Function "Edit items"
    editItem(item) {
      this.editedIndex = this.items.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    // Function "Delete items"
    deleteItem(item) {
      this.editedIndex = this.items.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.items.splice(this.editedIndex, 1);
    },

    // Function "Close dialog"
    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    // Function "Clear data"
    clear() {
      this.title = null;
      this.userId = null;
      this.id = null;
      this.username = null;
      this.email = null;
    },

    // Function "Save data"
    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.items[this.editedIndex], this.editedItem);
      } else {
        this.items.push(this.editedItem);
      }
      this.close();
      this.clear();
    },

    // Function "Edit todo row"
    edit(todo) {
      this.editableTodo = todo;
      this.editDialog = !this.editDialog;
    },

    // Function for quantity input
    quantityToZero() {
      let Quantity = this.quantity;
      if (Quantity > 200) {
        alert("Max todos are 200");
        return null;
      }
      return this.quantity;
    },
  },
};
</script>
