<template>

  <div class='col'>
    <div class='card' :class='cardClass'>
      <div class='card-header pb-1 h4' :class='headerClass'>
        {{ note.name }}
      </div>
      <div class='card-body pt-1' :class='bodyClass'
        v-html='note.short_content'></div>
      <div class='card-body pt-1'>
        <b-button v-b-toggle='[`collapse-${note.id}`]' size='sm' variant=''
          class='btn-sm w-100 btn-gradient-primary waves-effect waves-float waves-light'>{{ $t('note-item.detail') }}</b-button>
        <b-collapse :id='`collapse-${note.id}`'>
          <ul class='list-group list-group-flush'>
            <li class='list-group-item border-0 px-0 bg-transparent text-reset' v-for='detail in detailFields' :key='detail.field'>
              <label class='d-flex'>
                <span class='d-flex align-items-center justify-content-between flex-grow-1'>
                  <span class='h5 d-block fw-bolder text-reset'>{{ $t(detail.label) }}</span>
                  <span>{{ note[detail.field] | date }}</span>
                </span>
              </label>
            </li>
            <li class='list-group-item border-0 px-0 bg-transparent text-reset'>
              <div class='cursor-pointer' @click.prevent='editNoteConfig(1)'>
                <span class="h5 d-block fw-bolder text-reset">{{ $t('note-item.tags') }}</span>
                <div>
                  <span v-if='!hasConfigTags'>{{ $t('note-item.no_tag') }}</span>
                  <span v-else class='badge me-50' :class='`badge-light-${getBadgeColor(index)}`'
                    v-for='(tag, index) in tagList' :key='index'>{{ tag }}</span>
                </div>
              </div>
            </li>
          </ul>
        </b-collapse>
      </div>
      <div class='card-footer p-1'>
        <b-dropdown
          split size='sm'
          split-variant='outline-primary'
          variant='warning' @click.prevent='editNote'
          :text="$t('note-item.edit')" toggle-text='' right
          class='waves-effect btn-reload'
        >
          <template #button-content>
            <edit-icon size='1.5x' />
          </template>
          <b-dropdown-item @click.prevent='editNote'><edit-icon size='1x' /> {{ $t('note-item.edit') }}</b-dropdown-item>
          <b-dropdown-item @click.prevent='renameNote'><tool-icon size='1x' /> {{ $t('note-item.rename') }}</b-dropdown-item>
        </b-dropdown>

        <button type='button' :title="$t('note-item.update_config')" @click.prevent='editNoteConfig(0)'
          class='btn btn-sm btn-outline-primary waves-effect waves-float waves-light'>
          <cpu-icon size='1.5x' />
        </button>
        <button type='button' :title="$t('note-item.delete')" @click.prevent='setConfirmDeleteNoteId(note.id)'
          class='btn btn-sm btn-danger waves-effect waves-float waves-light'>
          <trash-icon size='1.5x' />
        </button>
      </div>
    </div>
  </div>

</template>

<script src='./note-item.js'></script>
