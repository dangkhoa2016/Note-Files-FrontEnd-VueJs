<template>

  <b-modal id='modal-note-form' static centered :ok-disabled='!formValid || savingNote || loadingNote'
    :ok-title="$t('modal-note-form.ok_title')"
    :cancel-title="$t('cancel_title')"
    :no-close-on-backdrop='true' @ok='handleOk' size='lg'
    @hidden='onHidden' @hide='onHide' @shown='onShown'>

    <template #modal-header='{ close }'>
      <h4 class='mb-0'>{{ $t(`modal-note-form.modal_header_${isEdit ? 'edit' : 'add'}`) }}</h4>
      <button type='button' class='btn btn-close btn-sm' data-bs-dismiss='modal'
        :aria-label="$t('cancel_title')" @click.prevent='close()'></button>
    </template>

    <validation-observer ref='modal-form' class='form form-horizontal' tag='form'>
      <div class='row'>
        <div class='col-12'>
          <div class='mb-1'>
            <label class='col-form-label' for='txt-name'>{{ $t('modal-note-form.form.name') }}</label>
            <validation-provider :name="$t('modal-note-form.form.name')" tag='div' rules='required|min:3' v-slot='{ errors }'>
              <input type='text' required @keyup.enter='handleOk'
                class='form-control' :class="{ 'is-invalid': errors.length > 0 }" id='txt-name'
                aria-describedby='txt-name' tabindex='1' :disabled='loadingNote || savingNote'
                :placeholder="$t('modal-note-form.form.placeholder_name')" v-model='form.name' autocomplete='off' />
              <div class='fv-plugins-message-container invalid-feedback' v-html="errors.join('<br/>')"></div>
            </validation-provider>
          </div>
        </div>

        <div class='col-12'>
          <div class='mb-1'>
            <label class='col-form-label' for='txt-content'>{{ $t('modal-note-form.form.content') }}</label>
            <validation-provider :name="$t('modal-note-form.form.content')" tag='div' rules='required|min:3' v-slot='{ errors }'>
              <textarea type='text' required :disabled='loadingNote || savingNote'
                class='form-control' :class="{ 'is-invalid': errors.length > 0 }" id='txt-content'
                aria-describedby='txt-content' tabindex='2' rows='10'
                :placeholder="$t('modal-note-form.form.placeholder_content')" v-model='form.content'></textarea>
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

<script src='./modal-note-form.js'></script>
