<template>
  <!-- ==============================================
    ** Inner Banner **
    =================================================== -->
  <div class="inner-banner blog">
    <div class="container">
      <div class="row">
        <div class="col-sm-12">
          <div class="content">
            <h1>{{ publicacionData?.publicaciones_titulo || 'Publicación' }}</h1>
          </div>
          <h4>
            <router-link to="/">INICIO</router-link>
          </h4>
          <h5>
            <router-link to="/publicaciones">PUBLICACIONES</router-link>
          </h5>
          <h3 v-if="publicacionData?.publicaciones_titulo">{{ publicacionData.publicaciones_titulo }}</h3>
        </div>
      </div>
    </div>
  </div>

  <!-- ==============================================
    ** Blog Detail **
    =================================================== -->
  <div class="container blog-wrapper padding-lg">
    <div class="row">
      <div class="col-sm-8 blog-left" v-if="publicacionNotFound">
        <div class="single-blog-inner mb-0 text-center py-5">
          <i class="fa fa-newspaper-o text-muted" style="font-size: 4rem; opacity: 0.3;"></i>
          <h2 class="mt-4">Publicación no encontrada</h2>
          <p class="text-muted">
            La publicación que buscas no está disponible o fue eliminada.
          </p>
          <router-link to="/publicaciones" class="btn btn-outline mt-3">
            ← Volver a publicaciones
          </router-link>
        </div>
      </div>

      <div class="col-sm-8 blog-left" v-else-if="publicacionData">
        <ul class="blog-listing detail">
          <li> 
            <img
              :src="imageUrl + publicacionData.publicaciones_imagen"
              :alt="publicacionData.publicaciones_titulo || 'Imagen de publicación'"
              class="img-responsive"
              style="width: 100%; max-height: 400px; object-fit: cover; border-radius: 8px; cursor: zoom-in;"
              @click="zoomImage(publicacionData.publicaciones_imagen)"
            />
            
            <h2>{{ publicacionData.publicaciones_titulo }}</h2>
            
            <ul class="post-detail">
              <li>
                <span class="icon-date-icon ico"></span>
                <span class="bold">{{ formatearFecha(publicacionData.publicaciones_fecha) }}</span>
              </li>
              <li>
                Publicado Por: 
                <span class="bold">{{ publicacionData.publicaciones_autor || 'Administración' }}</span>
              </li>
              <li>
                <span class="label">
                  <router-link to="/publicaciones">
                    {{ publicacionData.publicaciones_tipo || 'PUBLICACIONES' }}
                  </router-link>
                </span>
              </li>
            </ul>
            
            <p class="left-aligned" v-html="publicacionData.publicaciones_descripcion"></p>

            <div class="mt-4">
              <button @click="clickBack()" class="btn btn-outline">
                ← Volver
              </button>
            </div>
          </li>
        </ul>
      </div>

      <div class="col-sm-8 blog-left" v-else>
        <div class="text-center py-5">
          <div class="spinner-border text-muted" role="status">
            <span class="visually-hidden">Cargando...</span>
          </div>
          <p class="mt-3 text-muted">Cargando publicación...</p>
        </div>
      </div>

      <div class="col-sm-4">
        <div class="blog-right">
          <SidebarCustom />
        </div>
      </div>

    </div>
  </div>

  <div v-if="showZoom" class="image-modal" @click="showZoom = false">
    <img :src="imageUrl + zoomedImage" alt="Vista ampliada" class="modal-img" />
    <span class="modal-close">&times;</span>
  </div>
</template>

<style scoped>
.bg-overlay-img {
  background-image: url("@/assets/Fondo2.jpg");
}

.text-muted {
  color: #6c757d;
}

.text-center {
  text-align: center;
}

.py-5 {
  padding: 3rem 0;
}

.mt-3 { margin-top: 1rem; }
.mt-4 { margin-top: 1.5rem; }
.mb-0 { margin-bottom: 0; }

.btn {
  display: inline-block;
  padding: 8px 20px;
  border-radius: 4px;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
  border: none;
}

.btn-outline {
  background: transparent;
  border: 1px solid var(--main-color, #c00014);
  color: var(--main-color, #c00014);
}

.btn-outline:hover {
  background: var(--main-color, #c00014);
  color: #fff;
}

/* Post detail */
.post-detail {
  list-style: none;
  padding: 0;
  margin: 0 0 1rem;
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  align-items: center;
}

.post-detail li {
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.post-detail .label {
  background: var(--main-color, #c00014);
  color: #fff;
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 0.85rem;
}

.post-detail .label a {
  color: inherit;
  text-decoration: none;
}

.post-detail .bold {
  font-weight: 600;
}

img.img-responsive {
  max-width: 100%;
  height: auto;
}

.spinner-border {
  width: 3rem;
  height: 3rem;
  border-width: 0.25em;
}
.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.image-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  cursor: zoom-out;
}

.modal-img {
  max-width: 90%;
  max-height: 90%;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.modal-close {
  position: absolute;
  top: 20px;
  right: 30px;
  color: #fff;
  font-size: 2.5rem;
  cursor: pointer;
  user-select: none;
}
</style>

<script>
import { mapState } from "vuex";
import SidebarCustom from "@/components/SidebarCustom.vue";

export default {
  name: "DetallePublicacion",
  
  data() {
    return {
      showZoom: false,
      zoomedImage: '',
    };
  },
  
  components: {
    SidebarCustom,
  },
  
  computed: {

    ...mapState(["publicaciones", "url_api"]),

    imageUrl() {
      return (process.env.VUE_APP_UPLOADS_URL || 'https://apiadministrador.upea.bo').trim();
    },

    publicacionData() {
      const pubId = parseInt(this.$route.params.idPub);
      
      if (!pubId || !this.publicaciones?.length) {
        return null;
      }

      const publicacion = this.publicaciones.find(p => p.publicaciones_id === pubId);

      if (!publicacion || !publicacion.publicaciones_id) {
        return null;
      }
      
      return publicacion;
    },

    publicacionNotFound() {
      return this.publicaciones?.length > 0 && !this.publicacionData;
    },
  },
  
  methods: {

    formatearFecha(fechaISO) {
      if (!fechaISO) return '';
      const meses = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
      const fecha = new Date(fechaISO);
      if (isNaN(fecha.getTime())) return fechaISO;
      return `${fecha.getDate()} de ${meses[fecha.getMonth()]} de ${fecha.getFullYear()}`;
    },

    zoomImage(imageName) {
      this.zoomedImage = imageName;
      this.showZoom = true;
    },

    clickBack() {
      this.$store.commit("clickLink");
      this.$router.go(-1);
    },
  },
  
  created() {
    this.$store.commit("loading");
  },
};
</script>