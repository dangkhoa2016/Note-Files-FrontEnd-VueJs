<template>
  
  <b-modal id='modal-import' centered :ok-disabled='!formValid || importing'
    :ok-title="$t('modal-import.ok_title')"
    :cancel-title="$t('cancel_title')"
    :no-close-on-backdrop='true' @ok='handleOk' size='lg'
    @hidden='onHidden' @shown='onShown' @hide='onHide' :cancel-disabled='importing'>

    <template #modal-header='{ close }'>
      <h4 class='mb-0'>{{ $t('modal-import.modal_header', { header_name: headerName }) }}</h4>
      <button type='button' class='btn btn-close btn-sm' data-bs-dismiss='modal'
        :aria-label="$t('cancel_title')" @click.prevent='close()'></button>
    </template>

    <validation-observer ref='modal-form' class='form form-horizontal' tag='form'>
      <div class='row'>
        <div class='col-12'>
          <div class='mb-1'>
            <label class='col-form-label' for='txt-url'>{{ $t('modal-import.form.txt_url') }}</label>
            <validation-provider :name="$t('modal-import.form.txt_url')" tag='div' rules='required|min:3|url' v-slot='{ errors }'>
              <input type='text' required
                class='form-control' :class="{ 'is-invalid': errors.length > 0 }" id='txt-url'
                aria-describedby='txt-url' tabindex='1'
                :placeholder="$t('modal-import.form.placeholder_txt_url')" v-model='form.url' autocomplete='off' />
              <div class='fv-plugins-message-container invalid-feedback' v-html="errors.join('<br/>')"></div>
            </validation-provider>
          </div>
        </div>

        <div class='col-12'>
          <div class='mb-1'>
            <label class='col-form-label' for='txt-authToken'>{{ $t('modal-import.form.txt_auth_token') }}</label>
            <validation-provider :name="$t('modal-import.form.txt_auth_token')" tag='div' rules='required|min:3' v-slot='{ errors }'>
              <input type='text' required
                class='form-control' :class="{ 'is-invalid': errors.length > 0 }" id='txt-authToken'
                aria-describedby='txt-authToken' tabindex='2'
                :placeholder="$t('modal-import.form.placeholder_txt_auth_token')" v-model='form.auth_token' autocomplete='off' />
              <div class='fv-plugins-message-container invalid-feedback' v-html="errors.join('<br/>')"></div>
            </validation-provider>
          </div>
        </div>

        <div class='col-12' :class="errorAction ? 'text-danger' : 'd-none'">
          {{ errorAction }}
        </div>
      </div>
    </validation-observer>
  </b-modal>

</template>

<script src='./modal-import.js'></script>
