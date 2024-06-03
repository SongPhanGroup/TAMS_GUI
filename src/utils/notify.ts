import Swal from "sweetalert2";

export const showMessage = (msg = '', type = 'success') => {
	const toast: any = Swal.mixin({
		toast: true,
		position: 'top',
		showConfirmButton: false,
		timer: 3000,
		customClass: {
			container: 'toast',
			title: 'space-icon-title',
		},
	});
	toast.fire({
		icon: type,
		title: msg,
		width: '400px',
		padding: '10px 20px',
	});
};
