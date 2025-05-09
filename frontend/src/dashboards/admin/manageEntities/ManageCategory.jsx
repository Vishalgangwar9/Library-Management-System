import React, { useEffect, useState } from "react";
import {
  addNewCategory,
  exportCategories,
  getAllCategories,
  updateCategory,
} from "../../../http";
import { toast } from "react-hot-toast";
import { FaEdit } from "react-icons/fa";
import { Modal, Pagination } from "../../../components";

const ManageCategory = () => {
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState({});
  const [isFirstRender, setIsFirstRender] = useState(true);
  const [showAddNewModel, setShowAddNewModel] = useState(false);
  const [showUpdateModel, setShowUpdateModel] = useState(false);

  const initialState = {
    _id: "",
    name: "",
    description: "",
  };
  const [formData, setFormData] = useState(initialState);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCloseAddNewModel = () => {
    setShowAddNewModel(false);
    setFormData(initialState);
  };

  const handleCloseUpdateModel = () => {
    setShowUpdateModel(false);
    setFormData(initialState);
  };

  const handleAddNew = (e) => {
    e.preventDefault();
    const promise = addNewCategory({
      name: formData.name,
      description: formData.description,
    });
    toast.promise(promise, {
      loading: "Saving...",
      success: () => {
        setFormData(initialState);
        fetchCategories();
        setShowAddNewModel(false);
        return "Category added successfully.";
      },
      error: (err) => {
        return err?.response?.data?.message || "Something went wrong!";
      },
    });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    const promise = updateCategory(formData._id, {
      name: formData.name,
      description: formData.description,
    });
    toast.promise(promise, {
      loading: "Updating...",
      success: () => {
        setFormData(initialState);
        fetchCategories();
        setShowUpdateModel(false);
        return "Category updated successfully.";
      },
      error: (err) => {
        console.log(err);
        return err?.response?.data?.message || "Something went wrong!";
      },
    });
  };

  const handleExport = () => {
    const promise = exportCategories();
    toast.promise(promise, {
      loading: "Exporting...",
      success: (response) => {
        window.open(response?.data?.downloadUrl);
        return "Exported successfully.";
      },
      error: (err) => {
        console.log(err);
        return "Something went wrong while exporting data.";
      },
    });
  };

  const fetchCategories = async () => {
    try {
      const { data } = await getAllCategories(query, currentPage);
      setData(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (isFirstRender) {
      setIsFirstRender(false);
      return;
    }
    setCurrentPage(1);
    const handler = setTimeout(() => {
      fetchCategories();
    }, 1000);

    return () => {
      clearTimeout(handler);
    };
  }, [query]);

  useEffect(() => {
    fetchCategories();
  }, [currentPage]);

  return (
    <div className="manage__section bg">
      <div className="header">
        <h2>Manage Categories</h2>
        <div>
          <button
            className="btn btn__secondary"
            onClick={() => {
              setShowAddNewModel(true);
            }}
          >
            Add New
          </button>
          <button className="btn btn__secondary" onClick={handleExport}>
            Export to CSV
          </button>
        </div>
      </div>

      <div className="filter">
        <input
          type="text"
          placeholder="Search category...."
          className="background__accent text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoComplete="off"
        />
        <button
          className="btn btn__primary"
          onClick={() => setQuery("")}
        >
          CLEAR
        </button>
      </div>

      <div className="table__wrapper">
        <table className="background__accent" cellSpacing="0" cellPadding="0">
          <thead className="bg__secondary">
            <tr>
              <td>ID</td>
              <td>Name</td>
              <td>Description</td>
              <td>Actions</td>
            </tr>
          </thead>
          <tbody>
            {data?.categories?.map((category) => (
              <tr key={category._id}>
                <td>{category._id}</td>
                <td>{category.name}</td>
                <td>{category.description}</td>
                <td>
                  <button
                    className="btn btn__warning"
                    onClick={() => {
                      setFormData({
                        _id: category._id,
                        name: category.name,
                        description: category.description,
                      });
                      setShowUpdateModel(true);
                    }}
                  >
                    <FaEdit />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        data={data}
      />

      {/* ADD NEW CATEGORY FORM */}
      <Modal
        title="ADD NEW CATEGORY"
        show={showAddNewModel}
        onClose={handleCloseAddNewModel}
      >
        <form onSubmit={handleAddNew}>
          <div className="form-control">
            <label htmlFor="categoryName">Category Name</label>
            <input
              type="text"
              id="categoryName"
              name="name"
              placeholder="Enter category name"
              className="bg text__color"
              value={formData.name}
              onChange={handleChange}
              autoComplete="category-name"
              required
            />
          </div>
          <div className="form-control">
            <label htmlFor="categoryDescription">Category Description (Optional)</label>
            <textarea
              id="categoryDescription"
              name="description"
              cols="30"
              rows="4"
              value={formData.description}
              onChange={handleChange}
              className="bg text__color"
              autoComplete="category-description"
            />
          </div>
          <div className="actions">
            <button
              className="btn btn__danger"
              type="button"
              onClick={handleCloseAddNewModel}
            >
              CANCEL
            </button>
            <button type="submit" className="btn btn__success">
              SUBMIT
            </button>
          </div>
        </form>
      </Modal>

      {/* UPDATE CATEGORY FORM */}
      <Modal
        title="UPDATE CATEGORY"
        show={showUpdateModel}
        onClose={handleCloseUpdateModel}
      >
        <form onSubmit={handleUpdate}>
          <div className="form-control">
            <label htmlFor="updateCategoryName">Category Name</label>
            <input
              type="text"
              id="updateCategoryName"
              name="name"
              placeholder="Enter category name"
              className="bg text__color"
              value={formData.name}
              onChange={handleChange}
              autoComplete="category-name"
              required
            />
          </div>
          <div className="form-control">
            <label htmlFor="updateCategoryDescription">Category Description (Optional)</label>
            <textarea
              id="updateCategoryDescription"
              name="description"
              cols="30"
              rows="4"
              value={formData.description}
              onChange={handleChange}
              className="bg text__color"
              autoComplete="category-description"
            />
          </div>
          <div className="actions">
            <button
              className="btn btn__danger"
              type="button"
              onClick={handleCloseUpdateModel}
            >
              CANCEL
            </button>
            <button type="submit" className="btn btn__success">
              UPDATE
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ManageCategory;
