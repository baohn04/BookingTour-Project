// Change Status
const buttonChangeStatus = document.querySelectorAll("[button-change-status]");
if (buttonChangeStatus.length > 0) {
  buttonChangeStatus.forEach((button) => {
    button.addEventListener("click", async () => {
      const path = button.getAttribute("data-api-path");
      const currentStatus = button.getAttribute("data-status");
      const id = button.getAttribute("data-id");
      const newStatus = currentStatus === "active" ? "inactive" : "active";

      const response = await fetch(`${path}/change-status/${newStatus}/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        }
      });

      const data = await response.json();

      if (data.code === 200) {
        // Update button UI
        if (newStatus === "active") {
          button.classList.remove("status-inactive");
          button.classList.add("status-active");
          button.innerHTML = '<i class="fas fa-check-circle me-1"></i><span>Hoạt động</span>';
        } else {
          button.classList.remove("status-active");
          button.classList.add("status-inactive");
          button.innerHTML = '<i class="fas fa-times-circle me-1"></i><span>Dừng hoạt động</span>';
        }
        button.setAttribute("data-status", newStatus);

        console.log("success");
      } else {
        console.log("error");
      }
    });
  });
}
// End Change Status

// Select Filter Status
const selectStatus = document.querySelector("[select-status]");
if (selectStatus) {
  const url = new URL(window.location.href);

  selectStatus.addEventListener("change", (e) => {
    e.preventDefault();

    const status = selectStatus.value;
    if (status) {
      url.searchParams.set("status", status);
    } else {
      url.searchParams.delete("status");
    }
    window.location.href = url.href;
  });
}
// End Select Filter Status

// Form Search
const formSearch = document.querySelector("#form-search");
if (formSearch) {
  let url = new URL(window.location.href);
  formSearch.addEventListener("submit", (e) => {
    e.preventDefault();
    const keyword = e.target.elements.keyword.value;
    if (keyword) {
      url.searchParams.set("keyword", keyword);
    } else {
      url.searchParams.delete("keyword");
    }
    window.location.href = url.href;
  });
}
// End Form Search

// Sort
const boxSort = document.querySelector("[sort]");
if (boxSort) {
  let url = new URL(window.location.href);
  const sortSelect = boxSort.querySelector("[sort-select]");
  const sortClear = boxSort.querySelector("[sort-clear]");

  // Sắp xếp
  sortSelect.addEventListener("change", (e) => {
    const value = e.target.value;
    const [sortKey, sortValue] = value.split("-");
    url.searchParams.set("sortKey", sortKey);
    url.searchParams.set("sortValue", sortValue);
    window.location.href = url.href;
  });

  // Hiển thị option sort đã chọn khi load lại
  const sortKey = url.searchParams.get("sortKey");
  const sortValue = url.searchParams.get("sortValue");

  if (sortKey && sortValue) {
    const string = `${sortKey}-${sortValue}`;
    const optionSelected = sortSelect.querySelector(
      `option[value='${string}']`
    );
    optionSelected.selected = true;
  }
}
// End Sort

// Pagination
const buttonPagination = document.querySelectorAll("[button-pagination]");
if (buttonPagination.length > 0) {
  let url = new URL(window.location.href);
  buttonPagination.forEach((button) => {
    button.addEventListener("click", () => {
      const page = button.getAttribute("button-pagination-value");
      url.searchParams.set("page", page);
      window.location.href = url.href;
    });
  });
}
// End Pagination

// Delete Item
const buttonDelete = document.querySelectorAll("[button-delete]");
if (buttonDelete.length > 0) {
  buttonDelete.forEach((button) => {
    button.addEventListener("click", async () => {
      const confirmMessage = button.getAttribute("data-confirm-delete") || "Bạn có chắc chắn muốn xóa?";
      
      // SweetAlert2 confirm
      const result = await Swal.fire({
        title: "Xác nhận xóa",
        text: confirmMessage,
        icon: "warning",
        showCancelButton: true,
        cancelButtonColor: "#6b7280",
        confirmButtonColor: "#ef4444",
        confirmButtonText: "Xóa",
        cancelButtonText: "Hủy",
        reverseButtons: false
      });

      if (!result.isConfirmed) {
        return;
      }

      const path = button.getAttribute("data-api-path");
      const id = button.getAttribute("data-id");

      try {
        const response = await fetch(`${path}/delete/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json"
          }
        });

        const data = await response.json();

        if (data.code === 200) {
          // Show success toast
          const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: false
          });
          Toast.fire({
            icon: "success",
            title: data.message || "Xóa thành công!"
          });

          // Remove the row from table
          const row = button.closest("tr");
          if (row) {
            row.style.transition = "opacity 0.3s ease";
            row.style.opacity = "0";
            setTimeout(() => {
              row.remove();
              updateRowNumbers();
            }, 300);
          }
        } else {
          const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: false
          });
          Toast.fire({
            icon: "error",
            title: data.message || "Xóa không thành công!"
          });
        }
      } catch (error) {
        console.error("Error:", error);
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: false
        });
        Toast.fire({
          icon: "error",
          title: "Không thể kết nối đến server!"
        });
      }
    });
  });
}
// End Delete Item

// Gallery Script
const thumbnailSrc = document.querySelectorAll("[thumbnail-src]");
if (thumbnailSrc.length > 0) {
  thumbnailSrc.forEach(thumbnail => {
    thumbnail.addEventListener("click", () => {
      const src = thumbnail.getAttribute("thumbnail-src");
      document.getElementById('mainImage').src = src;
      document.querySelectorAll('.gallery-thumb').forEach(t => t.classList.remove('active'));
      thumbnail.classList.add('active');
    });
  });
}
// End Gallery Script

// Change Order Status
const buttonsChangeOrderStatus = document.querySelectorAll("[button-change-status][data-api-path*='/orders']");
if (buttonsChangeOrderStatus.length > 0) {
  const statusLabels = {
    'pending': 'chờ xử lý',
    'confirmed': 'đã xác nhận', 
    'cancelled': 'đã hủy'
  };

  buttonsChangeOrderStatus.forEach(button => {
    button.addEventListener("click", () => {
      const status = button.getAttribute("data-status");
      const id = button.getAttribute("data-id");
      const apiPath = button.getAttribute("data-api-path");

      Swal.fire({
        title: 'Xác nhận thay đổi?',
        text: `Bạn có chắc chắn muốn chuyển đơn hàng sang trạng thái "${statusLabels[status]}"?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: status === 'cancelled' ? '#d33' : '#28a745',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Xác nhận',
        cancelButtonText: 'Hủy'
      }).then((result) => {
        if (result.isConfirmed) {
          fetch(`${apiPath}/change-status/${status}/${id}`, {
            method: 'PATCH'
          })
          .then(response => response.json())
          .then(data => {
            if (data.code === 200) {
              Swal.fire('Thành công!', 'Đã cập nhật trạng thái đơn hàng.', 'success')
                .then(() => location.reload());
            } else {
              Swal.fire('Lỗi!', data.message, 'error');
            }
          });
        }
      });
    });
  });
}
// End Change Order Status