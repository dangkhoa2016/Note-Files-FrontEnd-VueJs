<template>
  
  <b-modal id='modal-delete-note' centered :ok-disabled='deletingNote'
    :ok-title="$t('modal-confirm.ok_title')"
    :cancel-title="$t('cancel_title')" ok-variant='danger'
    :no-close-on-backdrop='true' @ok='handleOk' size='lg'
    @hidden='onHidden' @shown='setNeedLogin(false)'>

    <template #modal-header='{ close }'>
      <h4 class='mb-0'>{{ $t('modal-confirm.modal_header') }}</h4>
      <button type='button' class='btn btn-close btn-sm' data-bs-dismiss='modal'
        :aria-label="$t('cancel_title')" @click.prevent='close()'></button>
    </template>

    <div class='modal-body'>
      <p>{{ $t('modal-confirm.confirm_message') }} <span class='text-danger'>{{ noteInfo }}</span> ?</p>
      <div class='col-12' :class="errorAction ? 'text-danger' : 'd-none'">
        {{ errorAction }}
      </div>
    </div>
  </b-modal>

</template>

<script src='./modal-confirm.js'></script>
