<template>

  <div class='card' :data-id='item.id' v-show='item.show'>
    <div class='card-body'>
      <validation-observer tag='div'
        class='form form-horizontal' v-slot='{ invalid }'>
        <div class='row d-flex mb-3'>
          <div class='col-md-8 col-12'>
            <div class='form-group'>
              <label class='col-form-label' :for='`txt-tag-${index}`'>{{ $t('tag-item.form.name') }} {{index + 1}}</label>
              <validation-provider :name="`${$t('tag-item.form.name')} ${index + 1}`" tag='div' rules='required|min:3' v-slot='{ errors }'>
                <input type='text' required :disabled='item.saving || loadingTags' :aria-describedby='`txt-tag-${index}`'
                  class='form-control' :class="{ 'is-invalid': errors.length > 0 }" :id='`txt-tag-${index}`'
                  :placeholder="`${$t('tag-item.form.placeholder_name')} ${index + 1}`" v-model='item.name' autocomplete='off' />
                <div class='fv-plugins-message-container invalid-feedback' v-html="errors.join('<br/>')"></div>
              </validation-provider>
            </div>
            <div class='form-group mt-1'>
              <label class='col-form-label'>{{ $t('tag-item.form.status') }} (
                <small class='form-text text-muted'>{{ $t('tag-item.form.current') }}: <strong>{{ item.enabled || false }}</strong></small>
              )</label>
              <div class='form-check form-check-success'>
                <input type='checkbox' class='form-check-input' :id='`chk-enabled-tag-${index}`' v-model='item.enabled'>
                <label class='form-check-label' :for='`chk-enabled-tag-${index}`'>{{ $t('tag-item.form.status_active') }}</label>
              </div>
            </div>
          </div>
          <div class='col-md-4 col-12'>
            <div class='row'>
              <div class='col-md-3 col-sm-6 align-top mt-1 mt-md-0'>
                <div class='form-group'>
                  <label class='col-form-label'>Id</label>
                  <input type='number' :title="isTemporatory ? '' : item.id"
                    class='form-control-sm form-control'
                    disabled aria-describedby='id' :value="isTemporatory ? '' : item.id" />
                </div>
              </div>

              <div class='col-md-9 col-sm-6 mb-50 align-top mt-1 mt-md-0'>
                <label class='col-form-label'>{{ $t('tag-item.form.action') }}</label>
                <div class='form-group'>
                  <button class='btn btn-outline-success btn-sm text-nowrap px-1 mr-2'
                    type='button' :disabled='invalid || item.saving || loadingTags' @click.prevent='saveTag'>
                    <save-icon size='1x' /> {{ $t('tag-item.form.save') }}
                  </button>

                  <button class='btn btn-outline-danger btn-sm text-nowrap px-1'
                    type='button' :disabled='item.saving || loadingTags' @click.prevent='showConfirmDelete'>
                    <x-icon size='1x' /> {{ $t('tag-item.form.delete') }}
                  </button>
                </div>
              </div>
            </div>
            <div class='form-group'>
              {{ $t('created_at') }}: {{ item.created_at | date }}<br/>
              {{ $t('updated_at') }}: {{ item.updated_at | date }}
            </div>
          </div>

          <div class='col-12' :class="errorAction ? 'text-danger mt-50' : 'd-none'">
            {{ errorAction }}
          </div>
        </div>
      </validation-observer>
    </div>
  </div>

</template>

<script src='./tag-item.js'></script>