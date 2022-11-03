<template>

  <validation-observer ref='settings-form' class='form form-horizontal' tag='form' v-slot='{ invalid }'>
    <div class='row'>
      <div class='col-12'>
        <h3>{{ $t('settings.main.header') }}</h3>
        <div class='mb-1'>
          <label class='col-form-label' for='txt-endpoint'>{{ $t('settings.main.endpoint') }}</label>
          <validation-provider :name="$t('settings.main.endpoint')" rules='required|min:3' tag='div' v-slot='{ errors }'>
            <input type='text' required aria-describedby='txt-endpoint'
              class='form-control' :class="{ 'is-invalid': errors.length > 0 }" id='txt-endpoint'
              :placeholder="$t('settings.main.placeholder_endpoint')" 
              v-model='form.endpoint' autocomplete='off' />
            <div class='fv-plugins-message-container invalid-feedback' v-html="errors.join('<br/>')"></div>
          </validation-provider>
        </div>
      </div>

      <div class='col-12 mt-2'>
        <h3>{{ $t('settings.notes_page.header') }}</h3>
      </div>
      <div class='col-md-4'>
        <div class='mb-1'>
          <label class='col-form-label' for='sel-notesPageSize'>{{ $t('settings.notes_page.per_page') }}</label>
          <v-select :get-option-label="option => $t(option.text)"
            :options='notesPageOptions' :placeholder="$t('select_placeholder')" v-model='form.notesPageSize'
            :reduce='option => option.value' :clearable='false' id='sel-notesPageSize' label='text'>
            <template slot='option' slot-scope='option'>
              {{ $t(option.text) }}
            </template>
          </v-select>
        </div>
      </div>
      <div class='col-md-4'>
        <div class='mb-1'>
          <label class='col-form-label' for='sel-notesSortBy'>{{ $t('settings.notes_page.sort_by') }}</label>
          <v-select :get-option-label="option => $t(option.text)"
            :options='notesSortOptions' :placeholder="$t('select_placeholder')" v-model='form.notesSortBy'
            :reduce='option => option.value' :clearable='false' id='sel-notesSortBy' label='text'>
            <template slot='option' slot-scope='option'>
              {{ $t(option.text) }}
            </template>
          </v-select>
        </div>
      </div>
      <div class='col-md-4'>
        <div class='mb-1'>
          <label class='col-form-label' for='sel-notesSortDirection'>{{ $t('settings.notes_page.sort_direction') }}</label>
          <v-select :get-option-label="option => $t(option.text)"
            :options='directionOptions' :placeholder="$t('select_placeholder')" v-model='form.notesSortDirection'
            :reduce='option => option.value' :clearable='false' id='sel-notesSortDirection' label='text'>
            <template slot='option' slot-scope='option'>
              {{ $t(option.text) }}
            </template>
          </v-select>
        </div>
      </div>

      <div class='col-12'>
        <b-button variant='secondary' :disabled='invalid || submitting'
          @click.prevent='save'>{{ $t('settings.save') }}</b-button>
        <b-button variant='primary' :disabled='submitting'
          @click.prevent='reset'>{{ $t('settings.reset') }}</b-button>
      </div>
    </div>
  </validation-observer>

</template>

<script src='./settings.js'></script>
