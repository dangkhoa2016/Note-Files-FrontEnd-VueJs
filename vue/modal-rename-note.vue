<template>
  
  <b-modal id='modal-rename-note' static centered :ok-disabled='!formValid || renamingNote'
    :ok-title="$t('modal-rename-note.ok_title')"
    :cancel-title="$t('cancel_title')"
    :no-close-on-backdrop='true' @ok='handleOk' size='lg'
    @hidden='onHidden' @hide='onHide' @shown='onShown'>

    <template #modal-header='{ close }'>
      <h4 class='mb-0'>{{ $t('modal-rename-note.modal_header') }}</h4>
      <button type='button' class='btn btn-close btn-sm' data-bs-dismiss='modal'
        :aria-label="$t('cancel_title')" @click.prevent='close()'></button>
    </template>

    <validation-observer ref='modal-form' class='form form-horizontal' tag='form'>
      <div class='row'>
        <div class='col-12'>
          <div class='mb-1'>
            <label class='col-form-label' for='txt-oldName'>{{ $t('modal-rename-note.form.old_name') }}</label>
            <input type='text' readonly
              class='form-control' id='txt-oldName'
              aria-describedby='txt-oldName' tabindex='1'
              v-model='form.old_name' autocomplete='off' />
            <div class='mt-50'>ID: {{ noteInfo.id }}</div>
          </div>
        </div>

        <div class='col-12'>
          <div class='mb-1'>
            <label class='col-form-label' for='txt-newName'>{{ $t('modal-rename-note.form.new_name') }}</label>
            <validation-provider :name="$t('modal-rename-note.form.new_name')" tag='div' rules='required|min:3' v-slot='{ errors }'>
              <input type='text' required
                class='form-control' :class="{ 'is-invalid': errors.length > 0 }" id='txt-newName'
                aria-describedby='txt-newName' @keyup.enter='handleOk'
                :placeholder="$t('modal-rename-note.form.placeholder_new_name')"
                v-model='form.new_name' autocomplete='off' />
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

<script src='./modal-rename-note.js'></script>
