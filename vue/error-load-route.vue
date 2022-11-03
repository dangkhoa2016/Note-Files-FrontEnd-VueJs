<template>

  <b-modal id='modal-error-load-route' centered :ok-disabled='deletingNote'
    :ok-title="$t('error-load-route.ok_title')"
    :cancel-title="$t('cancel_title')" ok-variant='success'
    :no-close-on-backdrop='true' @ok="$emit('reload')" size='lg'>

    <template #modal-header='{ close }'>
      <h4 class='mb-0'>{{ $t('error-load-route.modal_header') }}</h4>
      <button type='button' class='btn btn-close btn-sm' data-bs-dismiss='modal'
        :aria-label="$t('cancel_title')" @click.prevent='close()'></button>
    </template>

    <div class='modal-body'>
      <img src='https://summer-rain-10d0.dangkhoa2016.workers.dev/images/illustration/personalization.svg' class='card-img-top' alt='Error'>
      <div class='alert alert-warning' role='alert'>
        <div class='alert-body'>
          <p><alert-triangle-icon size='2x' class='' /> {{ $t('error-load-route.text') }}</p>
        </div>
      </div>
    </div>
  </b-modal>

</template>

<script>
export default {
  components: {
    'alert-triangle-icon': vueFeatherIcons.AlertTriangleIcon,
  },
};
</script>
