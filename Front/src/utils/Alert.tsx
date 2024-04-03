import Swal from 'sweetalert2'
import img from '../assets/garma.jpg'
import { SweetAlertIcon } from 'sweetalert2'
import 'animate.css/animate.min.css'

type AlertProps = {
    title : string;
    content : string;
    icon : SweetAlertIcon;
}


const Alert = (data :AlertProps) => {
    return Swal.fire({
        title: data.title,
        html : data.content,
        icon: data.icon,
        customClass: {
          popup: 'custom-style',
        },
        showClass: {
          popup: `
            animate__animated
            animate__bounceIn
            animate__fast
          `
        },
        hideClass: {
          popup: `
            animate__animated
            animate__bounceOutUp
            animate__faster
          `
        }
      });
}

export const ImageAlert = (data :AlertProps) => {
    return Swal.fire({
        title: data.title,
        width: 600,
        padding: "3em",
        color: "#716add",
        background: "#fff url(/images/trees.png)",
        backdrop: `
          rgba(0,0,123,0.4)
          url(${img})
          left top
          no-repeat
        `
      });
}

export const ConfirmAlert = (data: AlertProps) => {
  return Swal.fire({
    title: data.title,
    html : data.content,
        icon: data.icon,
        showClass: {
          popup: `
            animate__animated
            animate__fadeInUp
            animate__faster
          `
        },
        hideClass: {
          popup: `
            animate__animated
            animate__fadeOutDown
            animate__faster
          `
        },
    showCancelButton: true,
    // confirmButtonColor: "#3085d6",
    cancelButtonColor: "#8D8D95",
    cancelButtonText: "No",
    confirmButtonText: "Yes"
  }).then((result) => {
    if (result.isConfirmed) {
      return true;
    }
    return false;
  });
}

export default Alert
