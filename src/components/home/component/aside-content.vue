<template>
  <div class="about-me">
    <h2 class="title"><slot name="title" /></h2>
    <div class="content">
      <slot name="content" />
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {}
  }
}
</script>
<style lang="less" scoped>
.about-me {
  width: 100%;
  margin-top: 20px;
  background-color: #fff;
  .title {
    font-size: 18px;
    color: #333;
    line-height: 40px;
    padding-left: 22px;
    font-weight: bold;
    border-bottom: 1px solid #e5e5e5;
  }
  .content {
    font-size: 14px;
    line-height: 25px;
    color: #555555;
    padding: 10px;
    padding-left: 20px;
    .active {
      color: #409EFF;
    }
    p span {
      text-decoration: none;
      margin-left: 3px;
    }
    p, a {
      line-height: 35px;
      display: block;
      cursor: pointer;
      color: #555555;
      text-decoration: underline;
      &:hover {
        color: #409EFF;
      }
    }
    img {
      width: 120px;
      height: 80px;
      float: left;
    }
    .recommend {
      padding-left: 0px;
    }
    ul li{
      list-style: none;
      line-height: 30px;
      height: 30px;
      display: inline-block;
      padding-right: 5px;
      cursor: pointer;
      &:hover {
        color: #409EFF;
      }
      &:last-child {
        padding-right: 0;
      }
    }
  }
}
</style>
