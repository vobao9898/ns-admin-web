import { t } from 'i18next';

const Component = {
  success: ({
    text,
    title = t('components.message.Success'),
    cancelButtonText = t('components.message.Close'),
    showCloseButton = true,
    showCancelButton = true,
    showConfirmButton = false,
    padding = 0,
    timer = 3000,
  }) =>
    import('sweetalert2').then(({ default: Swal }) =>
      Swal.fire({
        icon: 'success',
        timer,
        title,
        text,
        cancelButtonText,
        showCloseButton,
        showCancelButton,
        showConfirmButton,
        padding,
      }),
    ),
  warning: ({
    text,
    title = t('components.message.Warning'),
    cancelButtonText = t('components.message.Close'),
    confirmButtonText = t('components.message.Ok'),
    showCloseButton = true,
    showCancelButton = true,
    showConfirmButton = true,
    padding = 0,
  }) =>
    import('sweetalert2').then(({ default: Swal }) =>
      Swal.fire({
        icon: 'warning',
        title,
        text,
        cancelButtonText,
        confirmButtonText,
        showCloseButton,
        showCancelButton,
        showConfirmButton,
        padding,
      }),
    ),
  error: ({
    text,
    title = t('components.message.Fail'),
    cancelButtonText = t('components.message.Close'),
    showCloseButton = true,
    showCancelButton = true,
    showConfirmButton = false,
    padding = 0,
  }) =>
    import('sweetalert2').then(({ default: Swal }) =>
      Swal.fire({
        icon: 'error',
        title,
        text,
        cancelButtonText,
        showCloseButton,
        showCancelButton,
        showConfirmButton,
        padding,
        focusCancel: showCancelButton,
      }),
    ),
  confirm: ({
    text,
    title = '',
    cancelButtonText = t('components.message.Close'),
    confirmButtonText = t('components.message.Ok'),
    onConfirm,
    onDenied = () => null,
    confirmButtonColor = '#3b82f6',
    cancelButtonColor = '#ef4444',
    showCloseButton = true,
    showCancelButton = true,
    showConfirmButton = true,
    padding = 0,
  }) =>
    import('sweetalert2').then(({ default: Swal }) =>
      Swal.fire({
        icon: 'warning',
        text,
        title,
        cancelButtonText,
        confirmButtonText,
        confirmButtonColor,
        cancelButtonColor,
        showCancelButton,
        showConfirmButton,
        showCloseButton,
        padding,
      }).then((result) => {
        if (result.isConfirmed) {
          onConfirm();
        } else if (result.isDismissed) {
          onDenied();
        }
      }),
    ),
};
export default Component;
