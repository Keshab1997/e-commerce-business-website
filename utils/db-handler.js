// Firebase Database Handler
class DBHandler {
  static async saveData(path, data) {
    try {
      await db.ref(path).set(data);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  static async getData(path) {
    try {
      const snapshot = await db.ref(path).once('value');
      return { success: true, data: snapshot.val() };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  static async updateData(path, data) {
    try {
      await db.ref(path).update(data);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  static async deleteData(path) {
    try {
      await db.ref(path).remove();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}