<template>

  <b-modal id='modal-note-config' static centered :ok-disabled='!formValid || updatingNoteConfig'
    :ok-title="$t('modal-note-config.ok_title')"
    :cancel-title="$t('cancel_title')"
    :no-close-on-backdrop='true'
    @ok='saveConfig' size='lg' @hide='onHide'>

    <template #modal-header='{ close }'>
      <h4 class='mb-0'>{{ $t('modal-note-config.modal_header') }}</h4>
      <button type='button' class='btn btn-close btn-sm' data-bs-dismiss='modal'
        :aria-label="$t('cancel_title')" @click.prevent='close()'></button>
    </template>

    <validation-observer ref='modal-form' class='form form-horizontal' tag='form'>
      <b-tabs justified v-model='activeTab'>
        <b-tab>
          <template #title>
            <chrome-icon /> {{ $t('modal-note-config.form.color') }}
          </template>
          <h3 class='mb-0'>{{ $t('modal-note-config.form.whole_block') }}</h3>
          <div class='row mb-2'>
            <div class='col-4'>
              <label class='col-form-label' for='sel-whole-borderColor'>{{ $t('modal-note-config.form.border_color') }}</label>
              <v-select :options='borderColors' :placeholder="$t('select_placeholder')"
                v-model='configForm.whole.borderColor' id='sel-whole-borderColor'>
                <template slot='option' slot-scope='option'>
                  {{ option.label }}
                </template>
              </v-select>
            </div>
            <div class='col-4'>
              <label class='col-form-label' for='sel-whole-bgColor'>{{ $t('modal-note-config.form.background_color') }}</label>
              <v-select :options='bgColors' :placeholder="$t('select_placeholder')"
                v-model='configForm.whole.bgColor' id='sel-whole-bgColor'>
                <template slot='option' slot-scope='option'>
                  {{ option.label }}
                </template>
              </v-select>
            </div>
            <div class='col-4'>
              <label class='col-form-label' for='sel-whole-textColor'>{{ $t('modal-note-config.form.text_color') }}</label>
              <v-select :options='textColors' :placeholder="$t('select_placeholder')"
                v-model='configForm.whole.textColor' id='sel-whole-textColor'>
                <template slot='option' slot-scope='option'>
                  {{ option.label }}
                </template>
              </v-select>
            </div>
          </div>

          <h3 class='mb-0'>{{ $t('modal-note-config.form.header') }}</h3>
          <div class='row mb-2'>
            <div class='col-4'>
              <label class='col-form-label' for='sel-header-borderColor'>{{ $t('modal-note-config.form.border_color') }}</label>
              <v-select :options='borderColors' :placeholder="$t('select_placeholder')"
                v-model='configForm.header.borderColor' id='sel-header-borderColor'>
                <template slot='option' slot-scope='option'>
                  {{ option.label }}
                </template>
              </v-select>
            </div>
            <div class='col-4'>
              <label class='col-form-label' for='sel-header-bgColor'>{{ $t('modal-note-config.form.background_color') }}</label>
              <v-select :options='bgColors' :placeholder="$t('select_placeholder')"
                v-model='configForm.header.bgColor' id='sel-header-bgColor'>
                <template slot='option' slot-scope='option'>
                  {{ option.label }}
                </template>
              </v-select>
            </div>
            <div class='col-4'>
              <label class='col-form-label' for='sel-header-textColor'>{{ $t('modal-note-config.form.text_color') }}</label>
              <v-select :options='textColors' :placeholder="$t('select_placeholder')"
                v-model='configForm.header.textColor' id='sel-header-textColor'>
                <template slot='option' slot-scope='option'>
                  {{ option.label }}
                </template>
              </v-select>
            </div>
          </div>

          <h3 class='mb-0'>{{ $t('modal-note-config.form.content') }}</h3>
          <div class='row'>
            <div class='col-4'>
              <label class='col-form-label' for='sel-body-textColor'>{{ $t('modal-note-config.form.border_color') }}</label>
              <v-select :options='borderColors' :placeholder="$t('select_placeholder')"
                v-model='configForm.body.borderColor' id='sel-body-textColor'>
                <template slot='option' slot-scope='option'>
                  {{ option.label }}
                </template>
              </v-select>
            </div>
            <div class='col-4'>
              <label class='col-form-label' for='sel-body-bgColor'>{{ $t('modal-note-config.form.background_color') }}</label>
              <v-select :options='bgColors' :placeholder="$t('select_placeholder')"
                v-model='configForm.body.bgColor' id='sel-body-bgColor'>
                <template slot='option' slot-scope='option'>
                  {{ option.label }}
                </template>
              </v-select>
            </div>
            <div class='col-4'>
              <label class='col-form-label' for='sel-body-textColor'>{{ $t('modal-note-config.form.text_color') }}</label>
              <v-select :options='textColors' :placeholder="$t('select_placeholder')"
                v-model='configForm.body.textColor' id='sel-body-textColor'>
                <template slot='option' slot-scope='option'>
                  {{ option.label }}
                </template>
              </v-select>
            </div>
          </div>
        </b-tab>

        <b-tab>
          <template #title>
            <tag-icon /> {{ $t('modal-note-config.form.tags') }}
          </template>
          <div class='alert alert-primary' role='alert' v-if='errorLoadTags'>
            <div class='alert-body'>
              <alert-circle-icon />
              <span>{{ errorLoadTags }}</span>
            </div>
          </div>
          <v-select v-else :options='tags' :placeholder="$t('select_placeholder')" :disabled='loadingTags || !hasTags'
            v-model='configForm.tags' id='sel-tags' multiple
            :reduce='option => option && option.id' label='name'>
            <template slot='option' slot-scope='option'>
              {{ option.name }}
            </template>
          </v-select>
        </b-tab>
      </b-tabs>

      <div class='col-12' :class="errorAction ? 'text-danger mt-1' : 'd-none'">
        {{ errorAction }}
      </div>
    </validation-observer>
  </b-modal>

</template>

<script src='./modal-note-config.js'></script>
