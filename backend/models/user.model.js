class User {
  #name = "";
  #contactNumber = null;
  #city = "";
  #selectedCourses = null;
  #emailId = "";
  #gender = "";

  constructor(userParams) {
    const { name, contactNumber, city, selectedCourses, emailId, gender } =
      userParams || {};
    this.#name = name || this.#name;
    this.#contactNumber = contactNumber || this.#contactNumber;
    this.#city = city || this.#city;
    this.#selectedCourses = selectedCourses || this.#selectedCourses;
    this.#emailId = emailId || this.#emailId;
    this.#gender = gender || this.#gender;
  }

  getUserDetails() {
    return {
      name: this.#name,
      emailId: this.#emailId,
      contactNumber: this.#contactNumber,
      city: this.#city,
      selectedCourses: this.#selectedCourses,
      gender: this.#gender,
    };
  }

  isValidUserDetails() {}
}

export default User;
